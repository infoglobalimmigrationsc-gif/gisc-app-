// frontend/src/screens/application/ApplicationTrackerScreen.jsx
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';
import Icon from '../../components/Icon';

const STATUS_STEPS = [
  { id: 'registered', label: 'Application Registered', description: 'Your application has been received', color: '#27AE60' },
  { id: 'docs_submitted', label: 'Documents Submitted', description: 'All required documents uploaded', color: '#F39C12' },
  { id: 'under_review', label: 'Under Review', description: 'Counselor reviewing your profile', color: '#3498DB' },
  { id: 'applied', label: 'Applied to University', description: 'Application submitted to institution', color: '#9B59B6' },
  { id: 'admission_received', label: 'Admission Received', description: 'Congratulations! Offer letter available', color: '#27AE60' },
  { id: 'visa_processing', label: 'Visa Processing', description: 'Visa application in progress', color: '#E67E22' },
];

const ApplicationTrackerScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [application, setApplication] = useState(null);
  const [currentStatus, setCurrentStatus] = useState('registered');

  useEffect(() => { loadApplicationStatus(); }, []);

  const loadApplicationStatus = async () => {
    try {
      const response = await api.get('/application/status');
      if (response.data.success) {
        setApplication(response.data.application);
        setCurrentStatus(response.data.application?.status || 'registered');
      }
    } catch (error) {} finally {
      setLoading(false); setRefreshing(false);
    }
  };

  const onRefresh = () => { setRefreshing(true); loadApplicationStatus(); };
  const currentStepIndex = STATUS_STEPS.findIndex(step => step.id === currentStatus);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1a3a5c" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Application Tracker</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Application ID Card */}
        <View style={styles.idCard}>
          <Text style={styles.idLabel}>Application ID</Text>
          <Text style={styles.idValue}>{application?.applicationId || 'GISC-2026-0001'}</Text>
          <Text style={styles.idDate}>Submitted: April 22, 2026</Text>
        </View>

        {/* Current Status */}
        <View style={[styles.statusBanner, { backgroundColor: STATUS_STEPS[currentStepIndex]?.color + '14' }]}>
          <View style={[styles.statusIconCircle, { backgroundColor: STATUS_STEPS[currentStepIndex]?.color }]}>
            <Text style={styles.statusIconText}>{currentStepIndex + 1}</Text>
          </View>
          <View style={styles.statusInfo}>
            <Text style={[styles.statusTitle, { color: STATUS_STEPS[currentStepIndex]?.color }]}>
              {STATUS_STEPS[currentStepIndex]?.label}
            </Text>
            <Text style={styles.statusDesc}>{STATUS_STEPS[currentStepIndex]?.description}</Text>
          </View>
        </View>

        {/* Timeline */}
        <View style={styles.timelineSection}>
          <Text style={styles.timelineTitle}>Progress Timeline</Text>
          {STATUS_STEPS.map((step, index) => {
            const completed = index <= currentStepIndex;
            const active = index === currentStepIndex;
            return (
              <View key={step.id} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View style={[styles.timelineDot, completed && { backgroundColor: step.color }, active && styles.timelineDotActive]} />
                  {index < STATUS_STEPS.length - 1 && (
                    <View style={[styles.timelineLine, index < currentStepIndex && { backgroundColor: step.color }]} />
                  )}
                </View>
                <View style={[styles.timelineRight, active && styles.timelineRightActive]}>
                  <Text style={[styles.timelineStepLabel, completed && { color: step.color }]}>{step.label}</Text>
                  <Text style={styles.timelineStepDesc}>{step.description}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Estimate */}
        <View style={styles.estimateCard}>
          <Text style={styles.estimateTitle}>Estimated Timeline</Text>
          <View style={styles.estimateRow}>
            <Text style={styles.estimateLabel}>Document Review</Text>
            <Text style={styles.estimateValue}>1-2 business days</Text>
          </View>
          <View style={styles.estimateRow}>
            <Text style={styles.estimateLabel}>University Application</Text>
            <Text style={styles.estimateValue}>2-4 weeks</Text>
          </View>
          <View style={styles.estimateRow}>
            <Text style={styles.estimateLabel}>Admission Decision</Text>
            <Text style={styles.estimateValue}>4-8 weeks</Text>
          </View>
          <View style={styles.estimateRow}>
            <Text style={styles.estimateLabel}>Visa Processing</Text>
            <Text style={styles.estimateValue}>2-4 weeks</Text>
          </View>
        </View>

        {/* Actions */}
        <TouchableOpacity style={styles.contactButton} onPress={() => navigation.navigate('Chat')}>
          <Text style={styles.contactButtonText}>Contact Your Counselor</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  backButton: { fontSize: 16, color: '#1a3a5c', fontWeight: '500' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1a3a5c' },
  scrollView: { flex: 1, paddingHorizontal: 20 },
  idCard: { backgroundColor: '#1a3a5c', borderRadius: 18, padding: 22, marginTop: 20, marginBottom: 18 },
  idLabel: { fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 },
  idValue: { fontSize: 24, fontWeight: 'bold', color: '#ffffff', letterSpacing: 1 },
  idDate: { fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 10 },
  statusBanner: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, padding: 18, marginBottom: 24 },
  statusIconCircle: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  statusIconText: { fontSize: 20, fontWeight: 'bold', color: '#ffffff' },
  statusInfo: { flex: 1 },
  statusTitle: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  statusDesc: { fontSize: 13, color: '#888888' },
  timelineSection: { marginBottom: 24 },
  timelineTitle: { fontSize: 18, fontWeight: '600', color: '#1a3a5c', marginBottom: 22 },
  timelineItem: { flexDirection: 'row', marginBottom: 24 },
  timelineLeft: { alignItems: 'center', marginRight: 16, width: 28 },
  timelineDot: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#e0e0e0' },
  timelineDotActive: { width: 18, height: 18, borderRadius: 9, borderWidth: 3, borderColor: '#ffffff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 3 },
  timelineLine: { width: 2, flex: 1, backgroundColor: '#e0e0e0', marginVertical: 4 },
  timelineRight: { flex: 1, paddingBottom: 4 },
  timelineRightActive: {},
  timelineStepLabel: { fontSize: 15, fontWeight: '600', color: '#888888', marginBottom: 4 },
  timelineStepDesc: { fontSize: 12, color: '#aaaaaa' },
  estimateCard: { backgroundColor: '#f8fafc', borderRadius: 16, padding: 18, marginBottom: 24, borderWidth: 1, borderColor: '#e8eef5' },
  estimateTitle: { fontSize: 15, fontWeight: '600', color: '#1a3a5c', marginBottom: 14 },
  estimateRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  estimateLabel: { fontSize: 13, color: '#666666' },
  estimateValue: { fontSize: 13, fontWeight: '500', color: '#1a3a5c' },
  contactButton: { backgroundColor: '#cc2936', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginBottom: 10 },
  contactButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
});

export default ApplicationTrackerScreen;
