import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [highQualityMode, setHighQualityMode] = useState(false);

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all your recognition history and settings. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All Data', style: 'destructive', onPress: () => {
          Alert.alert('Data Cleared', 'All data has been cleared successfully.');
        }}
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert('Export Data', 'Export functionality coming soon!');
  };

  const handlePrivacyPolicy = () => {
    Alert.alert('Privacy Policy', 'Privacy policy details coming soon!');
  };

  const handleTermsOfService = () => {
    Alert.alert('Terms of Service', 'Terms of service details coming soon!');
  };

  const renderSettingItem = (
    icon: string,
    title: string,
    subtitle?: string,
    rightComponent?: React.ReactNode,
    onPress?: () => void
  ) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>
          <Ionicons name={icon as any} size={24} color="#4CAF50" />
        </View>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightComponent}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          
          {renderSettingItem(
            'notifications-outline',
            'Push Notifications',
            'Get reminders and updates',
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#e0e0e0', true: '#4CAF50' }}
              thumbColor={notificationsEnabled ? 'white' : '#f4f3f4'}
            />
          )}
          
          {renderSettingItem(
            'location-outline',
            'Location Services',
            'Use location for council-specific guidance',
            <Switch
              value={locationEnabled}
              onValueChange={setLocationEnabled}
              trackColor={{ false: '#e0e0e0', true: '#4CAF50' }}
              thumbColor={locationEnabled ? 'white' : '#f4f3f4'}
            />
          )}
          
          {renderSettingItem(
            'save-outline',
            'Auto-Save History',
            'Automatically save recognition results',
            <Switch
              value={autoSaveEnabled}
              onValueChange={setAutoSaveEnabled}
              trackColor={{ false: '#e0e0e0', true: '#4CAF50' }}
              thumbColor={autoSaveEnabled ? 'white' : '#f4f3f4'}
            />
          )}
          
          {renderSettingItem(
            'camera-outline',
            'High Quality Mode',
            'Use higher quality images (slower processing)',
            <Switch
              value={highQualityMode}
              onValueChange={setHighQualityMode}
              trackColor={{ false: '#e0e0e0', true: '#4CAF50' }}
              thumbColor={highQualityMode ? 'white' : '#f4f3f4'}
            />
          )}
        </View>

        {/* Data Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          {renderSettingItem(
            'download-outline',
            'Export Data',
            'Export your recognition history',
            <Ionicons name="chevron-forward" size={20} color="#ccc" />,
            handleExportData
          )}
          
          {renderSettingItem(
            'trash-outline',
            'Clear All Data',
            'Delete all history and settings',
            <Ionicons name="chevron-forward" size={20} color="#f44336" />,
            handleClearData
          )}
        </View>

        {/* Council Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Council Settings</Text>
          
          {renderSettingItem(
            'location-outline',
            'Default Council',
            'Westminster',
            <Ionicons name="chevron-forward" size={20} color="#ccc" />,
            () => Alert.alert('Council Selection', 'Council selection coming soon!')
          )}
          
          {renderSettingItem(
            'calendar-outline',
            'Collection Schedule',
            'View local waste collection times',
            <Ionicons name="chevron-forward" size={20} color="#ccc" />,
            () => Alert.alert('Collection Schedule', 'Schedule view coming soon!')
          )}
        </View>

        {/* App Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Information</Text>
          
          {renderSettingItem(
            'information-circle-outline',
            'About WasteSmart',
            'Version 1.0.0',
            <Ionicons name="chevron-forward" size={20} color="#ccc" />,
            () => Alert.alert('About', 'WasteSmart v1.0.0\nAI-powered food waste recognition')
          )}
          
          {renderSettingItem(
            'shield-checkmark-outline',
            'Privacy Policy',
            'How we handle your data',
            <Ionicons name="chevron-forward" size={20} color="#ccc" />,
            handlePrivacyPolicy
          )}
          
          {renderSettingItem(
            'document-text-outline',
            'Terms of Service',
            'App usage terms and conditions',
            <Ionicons name="chevron-forward" size={20} color="#ccc" />,
            handleTermsOfService
          )}
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          {renderSettingItem(
            'help-circle-outline',
            'Help & FAQ',
            'Get help with the app',
            <Ionicons name="chevron-forward" size={20} color="#ccc" />,
            () => Alert.alert('Help', 'Help and FAQ coming soon!')
          )}
          
          {renderSettingItem(
            'mail-outline',
            'Contact Support',
            'Get in touch with our team',
            <Ionicons name="chevron-forward" size={20} color="#ccc" />,
            () => Alert.alert('Contact', 'Contact support coming soon!')
          )}
          
          {renderSettingItem(
            'star-outline',
            'Rate App',
            'Rate us on the App Store',
            <Ionicons name="chevron-forward" size={20} color="#ccc" />,
            () => Alert.alert('Rate App', 'Rating functionality coming soon!')
          )}
        </View>

        {/* Environmental Impact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Environmental Impact</Text>
          
          <View style={styles.impactCard}>
            <View style={styles.impactItem}>
              <Text style={styles.impactNumber}>24</Text>
              <Text style={styles.impactLabel}>Items Scanned</Text>
            </View>
            
            <View style={styles.impactItem}>
              <Text style={styles.impactNumber}>18</Text>
              <Text style={styles.impactLabel}>Recycled</Text>
            </View>
            
            <View style={styles.impactItem}>
              <Text style={styles.impactNumber}>6</Text>
              <Text style={styles.impactLabel}>Composted</Text>
            </View>
            
            <View style={styles.impactItem}>
              <Text style={styles.impactNumber}>2.4kg</Text>
              <Text style={styles.impactLabel}>CO₂ Saved</Text>
            </View>
          </View>
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
  header: {
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
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  settingItem: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f8f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  impactCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  impactItem: {
    alignItems: 'center',
  },
  impactNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  impactLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
});