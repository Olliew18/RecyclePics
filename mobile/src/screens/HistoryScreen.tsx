import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

interface HistoryItem {
  id: string;
  photo: string;
  detections: any[];
  timestamp: string;
  location: string;
}

export default function HistoryScreen() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'recyclable' | 'compostable'>('all');
  
  const history = useSelector((state: RootState) => state.recognition.history);

  const getBinColor = (color: string) => {
    const colors = {
      brown: '#8B4513',
      blue: '#2196F3',
      black: '#333333',
      green: '#4CAF50'
    };
    return colors[color as keyof typeof colors] || '#666';
  };

  const getBinEmoji = (color: string) => {
    const emojis = {
      brown: '🍃',
      blue: '♻️',
      black: '🗑️',
      green: '🌱'
    };
    return emojis[color as keyof typeof emojis] || '❓';
  };

  const filterHistory = (items: HistoryItem[]) => {
    if (selectedFilter === 'all') return items;
    
    return items.filter(item => {
      const hasRecyclable = item.detections.some((d: any) => d.bin_color === 'blue');
      const hasCompostable = item.detections.some((d: any) => d.bin_color === 'brown');
      
      if (selectedFilter === 'recyclable') return hasRecyclable;
      if (selectedFilter === 'compostable') return hasCompostable;
      return true;
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderHistoryItem = ({ item }: { item: HistoryItem }) => (
    <TouchableOpacity
      style={styles.historyItem}
      onPress={() => Alert.alert('Details', 'View detailed results')}
    >
      <Image source={{ uri: item.photo }} style={styles.historyImage} />
      
      <View style={styles.historyContent}>
        <View style={styles.historyHeader}>
          <Text style={styles.historyDate}>{formatDate(item.timestamp)}</Text>
          <Text style={styles.historyLocation}>{item.location}</Text>
        </View>
        
        <View style={styles.detectionsSummary}>
          {item.detections.map((detection, index) => (
            <View key={index} style={styles.detectionTag}>
              <View style={[styles.binIndicator, { backgroundColor: getBinColor(detection.bin_color) }]}>
                <Text style={styles.binEmoji}>{getBinEmoji(detection.bin_color)}</Text>
              </View>
              <Text style={styles.detectionText}>
                {detection.item.replace('_', ' ')}
              </Text>
            </View>
          ))}
        </View>
        
        <View style={styles.historyStats}>
          <Text style={styles.statsText}>
            {item.detections.length} item{item.detections.length !== 1 ? 's' : ''}
          </Text>
          <Text style={styles.statsText}>
            {item.detections.filter((d: any) => d.bin_color === 'blue').length} recyclable
          </Text>
          <Text style={styles.statsText}>
            {item.detections.filter((d: any) => d.bin_color === 'brown').length} compostable
          </Text>
        </View>
      </View>
      
      <TouchableOpacity
        style={styles.moreButton}
        onPress={() => Alert.alert('Options', 'More options coming soon')}
      >
        <Ionicons name="ellipsis-vertical" size={20} color="#666" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="time-outline" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>No History Yet</Text>
      <Text style={styles.emptySubtext}>
        Your recognition history will appear here after you scan some items
      </Text>
    </View>
  );

  const filteredHistory = filterHistory(history);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Recognition History</Text>
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => Alert.alert('Clear History', 'Clear all history?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Clear', style: 'destructive' }
          ])}
        >
          <Ionicons name="trash-outline" size={24} color="#f44336" />
        </TouchableOpacity>
      </View>

      {/* Filter tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, selectedFilter === 'all' && styles.filterTabActive]}
          onPress={() => setSelectedFilter('all')}
        >
          <Text style={[styles.filterText, selectedFilter === 'all' && styles.filterTextActive]}>
            All ({history.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterTab, selectedFilter === 'recyclable' && styles.filterTabActive]}
          onPress={() => setSelectedFilter('recyclable')}
        >
          <Text style={[styles.filterText, selectedFilter === 'recyclable' && styles.filterTextActive]}>
            Recyclable ({history.filter(item => item.detections.some((d: any) => d.bin_color === 'blue')).length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterTab, selectedFilter === 'compostable' && styles.filterTabActive]}
          onPress={() => setSelectedFilter('compostable')}
        >
          <Text style={[styles.filterText, selectedFilter === 'compostable' && styles.filterTextActive]}>
            Compostable ({history.filter(item => item.detections.some((d: any) => d.bin_color === 'brown')).length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* History list */}
      <FlatList
        data={filteredHistory}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />

      {/* Summary stats */}
      {history.length > 0 && (
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Total Impact</Text>
          <View style={styles.summaryStats}>
            <View style={styles.summaryStat}>
              <Text style={styles.summaryNumber}>{history.length}</Text>
              <Text style={styles.summaryLabel}>Scans</Text>
            </View>
            <View style={styles.summaryStat}>
              <Text style={styles.summaryNumber}>
                {history.reduce((total, item) => total + item.detections.length, 0)}
              </Text>
              <Text style={styles.summaryLabel}>Items</Text>
            </View>
            <View style={styles.summaryStat}>
              <Text style={styles.summaryNumber}>
                {history.reduce((total, item) => 
                  total + item.detections.filter((d: any) => d.bin_color === 'blue').length, 0
                )}
              </Text>
              <Text style={styles.summaryLabel}>Recycled</Text>
            </View>
            <View style={styles.summaryStat}>
              <Text style={styles.summaryNumber}>
                {history.reduce((total, item) => 
                  total + item.detections.filter((d: any) => d.bin_color === 'brown').length, 0
                )}
              </Text>
              <Text style={styles.summaryLabel}>Composted</Text>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  clearButton: {
    padding: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  filterTabActive: {
    backgroundColor: '#4CAF50',
  },
  filterText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  filterTextActive: {
    color: 'white',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  historyItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyImage: {
    width: 80,
    height: 80,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  historyContent: {
    flex: 1,
    padding: 12,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  historyDate: {
    fontSize: 12,
    color: '#666',
  },
  historyLocation: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  detectionsSummary: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  detectionTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  binIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  binEmoji: {
    fontSize: 8,
  },
  detectionText: {
    fontSize: 10,
    color: '#333',
  },
  historyStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statsText: {
    fontSize: 10,
    color: '#666',
  },
  moreButton: {
    padding: 12,
    justifyContent: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
  summaryContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryStat: {
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});