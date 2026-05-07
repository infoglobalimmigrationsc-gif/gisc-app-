// frontend/src/screens/application/ApplicationsScreen.jsx
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';

const ApplicationsScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('active');
  const [loading, setLoading] = useState(true);
  const [activeApplications, setActiveApplications] = useState([]);
  const [inactiveApplications, setInactiveApplications] = useState([]);

  useEffect(() => { loadApplications(); }, []);

  const loadApplications = async () => {
    try {
      const response = await api.get('/application/list');
      if (response.data?.success) {
        setActiveApplications(response.data.active || []);
        setInactiveApplications(response.data.inactive || []);
      }
    } catch (error) {} finally { setLoading(false); }
  };

  const statusColors = {
    registered: '#F39C12',
    docs_submitted: '#3b82f6',
    under_review: '#9B59B6',
    applied: '#3b82f6',
    admission_received: '#27AE60',
    visa_processing: '#cc2936',
  };

  const statusLabels = {
    registered: 'Registered',
    docs_submitted: 'Docs Submitted',
    under_review: 'Under Review',
    applied: 'Applied',
    admission_received: 'Offer Received',
    visa_processing: 'Visa Processing',
  };

  if (loading) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#cc2936" /></View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Applications</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'active' && styles.tabActive]}
          onPress={() => setActiveTab('active')}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.tabTextActive]}>Active</Text>
          <View style={[styles.tabCount, activeTab === 'active' && styles.tabCountActive]}>
            <Text style={[styles.tabCountText, activeTab === 'active' && styles.tabCountTextActive]}>{activeApplications.length}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'inactive' && styles.tabActive]}
          onPress={() => setActiveTab('inactive')}
        >
          <Text style={[styles.tabText, activeTab === 'inactive' && styles.tabTextActive]}>Inactive</Text>
          <View style={[styles.tabCount, activeTab === 'inactive' && styles.tabCountActive]}>
            <Text style={[styles.tabCountText, activeTab === 'inactive' && styles.tabCountTextActive]}>{inactiveApplications.length}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'active' && activeApplications.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No active applications yet</Text>
            <Text style={styles.emptySubtitle}>Explore courses and start your first application</Text>
            <TouchableOpacity style={styles.exploreButton} onPress={() => navigation.navigate('Explore')}>
              <Text style={styles.exploreButtonText}>Explore Courses</Text>
            </TouchableOpacity>
          </View>
        ) : (
          (activeTab === 'active' ? activeApplications : inactiveApplications).map((app) => (
            <TouchableOpacity
              key={app._id}
              style={styles.appCard}
              onPress={() => navigation.navigate('ApplicationTracker', { id: app._id })}
            >
              <View style={styles.appCardLeft}>
                <View style={styles.universityBadge}>
                  <Text style={styles.universityBadgeText}>{(app.preferredCountries?.[0] || 'CAN').substring(0, 3).toUpperCase()}</Text>
                </View>
              </View>
              <View style={styles.appCardCenter}>
                <Text style={styles.appCourseName}>{app.preferredCourses?.[0] || 'Course Application'}</Text>
                <Text style={styles.appCountry}>{app.preferredCountries?.join(', ') || 'Country'}</Text>
                {/* Progress Bar */}
                <View style={styles.progressBar}>
                  {['registered', 'docs_submitted', 'under_review', 'applied', 'admission_received', 'visa_processing'].map((step, idx) => {
                    const currentIdx = ['registered', 'docs_submitted', 'under_review', 'applied', 'admission_received', 'visa_processing'].indexOf(app.status);
                    return (
                      <View key={step} style={[styles.progressSegment, idx <= currentIdx && { backgroundColor: statusColors[step] || '#3b82f6' }]} />
                    );
                  })}
                </View>
              </View>
              <View style={styles.appCardRight}>
                <Text style={[styles.statusLabel, { color: statusColors[app.status] || '#3b82f6' }]}>
                  {statusLabels[app.status] || 'Processing'}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1a1a2e' },
  tabs: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 20 },
  tab: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20, marginRight: 12, backgroundColor: '#f5f5f5' },
  tabActive: { backgroundColor: '#1a1a2e' },
  tabText: { fontSize: 14, fontWeight: '500', color: '#888888', marginRight: 8 },
  tabTextActive: { color: '#ffffff' },
  tabCount: { backgroundColor: '#e0e0e0', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  tabCountActive: { backgroundColor: '#cc2936' },
  tabCountText: { fontSize: 12, fontWeight: '600', color: '#666666' },
  tabCountTextActive: { color: '#ffffff' },
  content: { flex: 1, paddingHorizontal: 20 },
  emptyState: { alignItems: 'center', paddingTop: 80 },
  emptyTitle: { fontSize: 20, fontWeight: '600', color: '#1a1a2e', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: '#888888', textAlign: 'center', marginBottom: 24 },
  exploreButton: { backgroundColor: '#cc2936', borderRadius: 12, paddingVertical: 14, paddingHorizontal: 30 },
  exploreButtonText: { color: '#ffffff', fontSize: 15, fontWeight: '600' },
  appCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 14, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#e0e0e0' },
  appCardLeft: { marginRight: 14 },
  universityBadge: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#3b82f6', justifyContent: 'center', alignItems: 'center' },
  universityBadgeText: { fontSize: 12, fontWeight: 'bold', color: '#ffffff' },
  appCardCenter: { flex: 1 },
  appCourseName: { fontSize: 15, fontWeight: '600', color: '#1a1a2e', marginBottom: 2 },
  appCountry: { fontSize: 12, color: '#888888', marginBottom: 10 },
  progressBar: { flexDirection: 'row', height: 3, borderRadius: 1.5, overflow: 'hidden' },
  progressSegment: { flex: 1, height: 3, backgroundColor: '#e0e0e0', marginHorizontal: 1 },
  appCardRight: {},
  statusLabel: { fontSize: 12, fontWeight: '600' },
});

export default ApplicationsScreen;
