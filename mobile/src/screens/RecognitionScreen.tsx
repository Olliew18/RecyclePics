import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { recognizeImage, addToHistory } from '../store/slices/recognitionSlice';
import { RootState } from '../store/store';

const { width } = Dimensions.get('window');

interface Detection {
  item: string;
  confidence: number;
  bin_color: string;
  category: string;
  disposal_note: string;
  requires_user_input: boolean;
  location_guidance: Record<string, string>;
}

export default function RecognitionScreen() {
  const [isProcessing, setIsProcessing] = useState(true);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [selectedLocation, setSelectedLocation] = useState('Westminster');
  
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute();
  const { photo } = route.params as { photo: { uri: string; base64: string } };

  const recognitionState = useSelector((state: RootState) => state.recognition);

  useEffect(() => {
    processImage();
  }, []);

  const processImage = async () => {
    try {
      setIsProcessing(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock detections
      const mockDetections: Detection[] = [
        {
          item: 'banana',
          confidence: 92.3,
          bin_color: 'brown',
          category: 'fruit',
          disposal_note: 'Organic waste - compost bin',
          requires_user_input: false,
          location_guidance: {
            'Westminster': 'Food waste bin (brown) - collected weekly on Wednesdays',
            'Tower Hamlets': 'Green caddy for food waste - collected twice weekly'
          }
        },
        {
          item: 'plastic_bottle',
          confidence: 87.5,
          bin_color: 'blue',
          category: 'container',
          disposal_note: 'Check if clean (recycling) or dirty (general waste)',
          requires_user_input: true,
          location_guidance: {
            'Westminster': 'Recycling bin (blue) if clean, general waste if contaminated',
            'Tower Hamlets': 'Mixed recycling bin - must be clean and cap removed'
          }
        }
      ];

      setDetections(mockDetections);
      
      // Add to history
      dispatch(addToHistory({
        id: Date.now().toString(),
        photo: photo.uri,
        detections: mockDetections,
        timestamp: new Date().toISOString(),
        location: selectedLocation
      }));

    } catch (error) {
      Alert.alert('Error', 'Failed to process image');
    } finally {
      setIsProcessing(false);
    }
  };

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

  const handleFeedback = (detection: Detection, isCorrect: boolean) => {
    // In real app, send feedback to backend
    Alert.alert(
      'Feedback Submitted',
      `Thank you for your feedback on ${detection.item.replace('_', ' ')}`
    );
  };

  if (isProcessing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Analyzing image...</Text>
          <Text style={styles.loadingSubtext}>AI is identifying food waste items</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#4CAF50" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Recognition Results</Text>
          <TouchableOpacity
            style={styles.shareButton}
            onPress={() => Alert.alert('Share', 'Share functionality coming soon')}
          >
            <Ionicons name="share-outline" size={24} color="#4CAF50" />
          </TouchableOpacity>
        </View>

        {/* Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: photo.uri }} style={styles.image} />
        </View>

        {/* Detections */}
        <View style={styles.detectionsContainer}>
          <Text style={styles.sectionTitle}>Detected Items</Text>
          
          {detections.map((detection, index) => (
            <View key={index} style={styles.detectionCard}>
              <View style={styles.detectionHeader}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>
                    {detection.item.replace('_', ' ').toUpperCase()}
                  </Text>
                  <Text style={styles.confidence}>
                    {detection.confidence}% confidence
                  </Text>
                </View>
                <View style={[styles.binIndicator, { backgroundColor: getBinColor(detection.bin_color) }]}>
                  <Text style={styles.binEmoji}>{getBinEmoji(detection.bin_color)}</Text>
                </View>
              </View>

              <Text style={styles.disposalNote}>{detection.disposal_note}</Text>

              {/* Location-specific guidance */}
              <View style={styles.locationGuidance}>
                <Text style={styles.locationTitle}>Local Rules ({selectedLocation})</Text>
                <Text style={styles.locationText}>
                  {detection.location_guidance[selectedLocation]}
                </Text>
              </View>

              {/* Feedback buttons */}
              <View style={styles.feedbackContainer}>
                <TouchableOpacity
                  style={[styles.feedbackButton, styles.correctButton]}
                  onPress={() => handleFeedback(detection, true)}
                >
                  <Ionicons name="checkmark" size={16} color="white" />
                  <Text style={styles.feedbackText}>Correct</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.feedbackButton, styles.incorrectButton]}
                  onPress={() => handleFeedback(detection, false)}
                >
                  <Ionicons name="close" size={16} color="white" />
                  <Text style={styles.feedbackText}>Incorrect</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.sectionTitle}>Disposal Summary</Text>
          
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Items:</Text>
              <Text style={styles.summaryValue}>{detections.length}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Recyclable:</Text>
              <Text style={styles.summaryValue}>
                {detections.filter(d => d.bin_color === 'blue').length}
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Compostable:</Text>
              <Text style={styles.summaryValue}>
                {detections.filter(d => d.bin_color === 'brown').length}
              </Text>
            </View>
          </View>
        </View>

        {/* Action buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Camera' as never)}
          >
            <Ionicons name="camera" size={20} color="white" />
            <Text style={styles.primaryButtonText}>Scan Another Item</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('History' as never)}
          >
            <Ionicons name="time" size={20} color="#4CAF50" />
            <Text style={styles.secondaryButtonText}>View History</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  shareButton: {
    padding: 8,
  },
  imageContainer: {
    padding: 16,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  detectionsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  detectionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  confidence: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  binIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  binEmoji: {
    fontSize: 20,
  },
  disposalNote: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
  },
  locationGuidance: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  locationTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#333',
  },
  feedbackContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  feedbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 100,
    justifyContent: 'center',
  },
  correctButton: {
    backgroundColor: '#4CAF50',
  },
  incorrectButton: {
    backgroundColor: '#f44336',
  },
  feedbackText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  summaryContainer: {
    padding: 16,
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  actionContainer: {
    padding: 16,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  secondaryButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});