// frontend/src/screens/application/ApplicationTrackerScreen.jsx
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import api from '../../services/api';

const STEPS = [
  { id: 'registered', label: 'Application Registered', color: '#F39C12' },
  { id: 'docs_submitted', label: 'Documents Submitted', color: '#3b82f6' },
  { id: 'under_review', label: 'Under Review', color: '#9B59B6' },
  { id: 'applied', label: 'Applied to University', color: '#3b82f6' },
  { id: 'admission_received', label: 'Admission Received', color: '#27AE60' },
  { id: 'visa_processing', label: 'Visa Processing', color: '#cc2936' },
];

const ApplicationTrackerScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [currentStatus, setCurrentStatus] = useState('registered');
  const [application, setApplication] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/application/status');
        if (res.data?.success) {
          setApplication(res.data.application);
          setCurrentStatus(res.data.application?.status || 'registered');
        }
      } catch (error) {} finally { setLoading(false); }
    };
    load();
  }, []);

  const currentIndex = STEPS.findIndex(s => s.id === currentStatus);

  if (loading) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#cc2936" /></View>;
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

      <ScrollView style={styles.scrollView}>
        {/* ID Card */}
        <View style={styles.idCard}>
          <Text style={styles.idLabel}>APPLICATION ID</Text>
          <Text style={styles.idValue}>{application?.applicationId || 'GISC-2026-0001'}</Text>
        </View>

        {/* Progress Percentage */}
        <View style={styles.percentageCard}>
          <Text style={styles.percentageLabel}>Overall Progress</Text>
          <View style={styles.percentageBarContainer}>
            <View style={[styles.percentageBar, { width: `${Math.round(((currentIndex + 1) / STEPS.length) * 100)}%` }]} />
          </View>
          <Text style={styles.percentageText}>{Math.round(((currentIndex + 1) / STEPS.length) * 100)}% Complete</Text>
        </View>

        {/* Stepper */}
        <View style={styles.timelineSection}>
          <Text style={styles.timelineTitle}>Application Timeline</Text>
          {STEPS.map((step, index) => {
            const completed = index <= currentIndex;
            const active = index === currentIndex;
            return (
              <View key={step.id} style={styles.timelineItem}>
                {/* Vertical Line */}
                <View style={styles.timelineLeft}>
                  <View style={[styles.timelineDot, completed && { backgroundColor: step.color }, active && styles.timelineDotActive]} />
                  {index < STEPS.length - 1 && (
                    <View style={[styles.timelineLine, index < currentIndex && { backgroundColor: '#3b82f6' }]} />
                  )}
                </View>
                {/* Content */}
                <View style={styles.timelineRight}>
                  <Text style={[styles.timelineStepLabel, completed && { color: step.color }]}>{step.label}</Text>
                  {active && <Text style={styles.timelineCurrent}>● Current Stage</Text>}
                </View>
              </View>
            );
          })}
        </View>

        {/* Actions */}
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Chat')}>
          <Text style={styles.actionButtonText}>Contact Counselor</Text>
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
  backButton: { fontSize: 16, color: '#1a1a2e', fontWeight: '500' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1a1a2e' },
  scrollView: { flex: 1, paddingHorizontal: 20 },
  idCard: { backgroundColor: '#cc2936', borderRadius: 18, padding: 22, marginTop: 20, marginBottom: 16 },
  idLabel: { fontSize: 11, color: 'rgba(255,255,255,0.6)', letterSpacing: 2, marginBottom: 6 },
  idValue: { fontSize: 24, fontWeight: 'bold', color: '#ffffff', letterSpacing: 1 },
  percentageCard: { backgroundColor: '#f8fafc', borderRadius: 16, padding: 18, marginBottom: 24, borderWidth: 1, borderColor: '#e0e0e0' },
  percentageLabel: { fontSize: 14, fontWeight: '500', color: '#1a1a2e', marginBottom: 10 },
  percentageBarContainer: { height: 8, backgroundColor: '#e0e0e0', borderRadius: 4, marginBottom: 8 },
  percentageBar: { height: 8, backgroundColor: '#cc2936', borderRadius: 4 },
  percentageText: { fontSize: 13, fontWeight: '600', color: '#cc2936', textAlign: 'right' },
  timelineSection: { marginBottom: 24 },
  timelineTitle: { fontSize: 18, fontWeight: '600', color: '#1a1a2e', marginBottom: 22 },
  timelineItem: { flexDirection: 'row', marginBottom: 28 },
  timelineLeft: { alignItems: 'center', marginRight: 16, width: 24 },
  timelineDot: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#e0e0e0' },
  timelineDotActive: { width: 22, height: 22, borderRadius: 11, borderWidth: 4, borderColor: '#cc2936', backgroundColor: '#ffffff' },
  timelineLine: { width: 2, flex: 1, backgroundColor: '#e0e0e0' },
  timelineRight: { flex: 1, paddingTop: 2 },
  timelineStepLabel: { fontSize: 15, fontWeight: '600', color: '#888888' },
  timelineCurrent: { fontSize: 11, color: '#cc2936', marginTop: 4 },
  actionButton: { backgroundColor: '#cc2936', borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  actionButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
});

export default ApplicationTrackerScreen;
