// frontend/src/screens/application/ApplicationsScreen.jsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';

const ApplicationsScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('active');
  const [loading, setLoading] = useState(true);
  const [activeApplications, setActiveApplications] = useState([]);
  const [inactiveApplications, setInactiveApplications] = useState([]);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const token = await AsyncStorage.getItem('gisc_token');
      const response = await api.get('/application/list', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setActiveApplications(response.data.active || []);
        setInactiveApplications(response.data.inactive || []);
      }
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyEmoji}>😊</Text>
      <Text style={styles.emptyTitle}>No active applications yet</Text>
      <Text style={styles.emptySubtitle}>
        Explore high-matching courses and get started on your very first application
      </Text>
      <TouchableOpacity
        style={styles.exploreButton}
        onPress={() => navigation.navigate('Explore')}
      >
        <Text style={styles.exploreButtonText}>Explore courses</Text>
      </TouchableOpacity>
    </View>
  );

  const renderApplicationCard = (app) => {
    const statusColors = {
      registered: '#3498DB',
      docs_submitted: '#F39C12',
      under_review: '#9B59B6',
      applied: '#1a3a5c',
      admission_received: '#27AE60',
      visa_processing: '#cc2936',
    };

    const statusLabels = {
      registered: 'Registered',
      docs_submitted: 'Documents Submitted',
      under_review: 'Under Review',
      applied: 'Applied',
      admission_received: 'Admission Received',
      visa_processing: 'Visa Processing',
    };

    return (
      <TouchableOpacity
        key={app._id}
        style={styles.appCard}
        onPress={() => navigation.navigate('ApplicationTracker', { id: app._id })}
      >
        <View style={styles.appCardHeader}>
          <Text style={styles.appCourseName}>{app.preferredCourses?.[0] || 'Course Application'}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColors[app.status] + '20' }]}>
            <Text style={[styles.statusText, { color: statusColors[app.status] }]}>
              {statusLabels[app.status]}
            </Text>
          </View>
        </View>
        
        <View style={styles.appDetails}>
          <Text style={styles.appDetail}>
            📍 {app.preferredCountries?.join(', ') || 'Country not specified'}
          </Text>
          <Text style={styles.appDetail}>
            📅 Submitted: {new Date(app.submittedAt).toLocaleDateString()}
          </Text>
        </View>

        {/* Progress bar */}
        <View style={styles.progressBar}>
          {['registered', 'docs_submitted', 'under_review', 'applied', 'admission_received', 'visa_processing'].map((step, index) => {
            const stepIndex = ['registered', 'docs_submitted', 'under_review', 'applied', 'admission_received', 'visa_processing'].indexOf(app.status);
            const isCompleted = index <= stepIndex;
            
            return (
              <View key={step} style={styles.progressStep}>
                <View style={[
                  styles.progressDot,
                  isCompleted && { backgroundColor: statusColors[step] },
                ]} />
                {index < 5 && (
                  <View style={[
                    styles.progressLine,
                    index < stepIndex && { backgroundColor: statusColors[step] },
                  ]} />
                )}
              </View>
            );
          })}
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1a3a5c" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Applications</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'active' && styles.tabActive]}
          onPress={() => setActiveTab('active')}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.tabTextActive]}>
            Active
          </Text>
          <View style={[styles.tabCount, activeTab === 'active' && styles.tabCountActive]}>
            <Text style={[styles.tabCountText, activeTab === 'active' && styles.tabCountTextActive]}>
              {activeApplications.length}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'inactive' && styles.tabActive]}
          onPress={() => setActiveTab('inactive')}
        >
          <Text style={[styles.tabText, activeTab === 'inactive' && styles.tabTextActive]}>
            Inactive
          </Text>
          <View style={[styles.tabCount, activeTab === 'inactive' && styles.tabCountActive]}>
            <Text style={[styles.tabCountText, activeTab === 'inactive' && styles.tabCountTextActive]}>
              {inactiveApplications.length}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'active' && activeApplications.length === 0
          ? renderEmptyState()
          : activeTab === 'active'
            ? activeApplications.map(renderApplicationCard)
            : inactiveApplications.map(renderApplicationCard)
        }
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a3a5c',
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#f5f5f5',
  },
  tabActive: {
    backgroundColor: '#1a3a5c',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#888888',
    marginRight: 8,
  },
  tabTextActive: {
    color: '#ffffff',
  },
  tabCount: {
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  tabCountActive: {
    backgroundColor: '#cc2936',
  },
  tabCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666666',
  },
  tabCountTextActive: {
    color: '#ffffff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a3a5c',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 40,
  },
  exploreButton: {
    backgroundColor: '#cc2936',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 30,
  },
  exploreButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  appCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  appCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  appCourseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a3a5c',
    flex: 1,
    marginRight: 10,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  appDetails: {
    marginBottom: 14,
  },
  appDetail: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 4,
  },
  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressStep: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#e0e0e0',
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#e0e0e0',
  },
});

export default ApplicationsScreen;
