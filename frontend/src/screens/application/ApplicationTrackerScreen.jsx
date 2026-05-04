// frontend/src/screens/application/ApplicationTrackerScreen.jsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'https://api.gisc-liberia.com/api';

const STATUS_STEPS = [
  { 
    id: 'registered', 
    label: 'Application Registered', 
    icon: 'checkmark-circle',
    description: 'Your application has been received',
    color: '#27AE60',
  },
  { 
    id: 'docs_submitted', 
    label: 'Documents Submitted', 
    icon: 'document-text',
    description: 'All required documents uploaded',
    color: '#F39C12',
  },
  { 
    id: 'under_review', 
    label: 'Under Review', 
    icon: 'search',
    description: 'Counselor reviewing your profile',
    color: '#3498DB',
  },
  { 
    id: 'applied', 
    label: 'Applied to University', 
    icon: 'send',
    description: 'Application submitted to institution',
    color: '#9B59B6',
  },
  { 
    id: 'admission_received', 
    label: 'Admission Received', 
    icon: 'trophy',
    description: 'Congratulations! Offer letter available',
    color: '#27AE60',
  },
  { 
    id: 'visa_processing', 
    label: 'Visa Processing', 
    icon: 'airplane',
    description: 'Visa application in progress',
    color: '#E67E22',
  },
];

const ApplicationTrackerScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [application, setApplication] = useState(null);
  const [currentStatus, setCurrentStatus] = useState('registered');
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    loadApplicationStatus();
  }, []);

  const loadApplicationStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('gisc_token');
      const response = await axios.get(`${API_URL}/application/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setApplication(response.data.application);
        setCurrentStatus(response.data.application?.status || 'registered');
        setTimeline(response.data.timeline || []);
      }
    } catch (error) {
      console.error('Error loading status:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadApplicationStatus();
  };

  const getCurrentStepIndex = () => {
    return STATUS_STEPS.findIndex(step => step.id === currentStatus);
  };

  const handleDocumentUpload = () => {
    navigation.navigate('DocumentUpload');
  };

  const handleViewOfferLetter = () => {
    if (application?.offerLetter) {
      navigation.navigate('DocumentViewer', { url: application.offerLetter });
    }
  };

  const handleContactCounselor = () => {
    navigation.navigate('Chat');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E3A5F" />
        <Text style={styles.loadingText}>Loading application status...</Text>
      </View>
    );
  }

  const currentStepIndex = getCurrentStepIndex();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1E3A5F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Application Tracker</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Application ID Card */}
        <View style={styles.appIdCard}>
          <Text style={styles.appIdLabel}>Application ID</Text>
          <Text style={styles.appIdValue}>{application?.applicationId || 'GISC-2024-001'}</Text>
          <Text style={styles.appDate}>
            Submitted: {application?.submittedDate || 'April 22, 2026'}
          </Text>
        </View>

        {/* Current Status Banner */}
        <View style={[styles.statusBanner, { backgroundColor: STATUS_STEPS[currentStepIndex]?.color + '15' }]}>
          <View style={[styles.statusIcon, { backgroundColor: STATUS_STEPS[currentStepIndex]?.color }]}>
            <Ionicons name={STATUS_STEPS[currentStepIndex]?.icon} size={24} color="#FFFFFF" />
          </View>
          <View style={styles.statusContent}>
            <Text style={[styles.statusTitle, { color: STATUS_STEPS[currentStepIndex]?.color }]}>
              {STATUS_STEPS[currentStepIndex]?.label}
            </Text>
            <Text style={styles.statusDescription}>
              {STATUS_STEPS[currentStepIndex]?.description}
            </Text>
          </View>
        </View>

        {/* Progress Tracker */}
        <View style={styles.trackerContainer}>
          <Text style={styles.trackerTitle}>Application Progress</Text>
          
          {STATUS_STEPS.map((step, index) => {
            const isCompleted = index <= currentStepIndex;
            const isActive = index === currentStepIndex;
            
            return (
              <View key={step.id} style={styles.trackerStep}>
                <View style={styles.trackerLeft}>
                  <View style={[
                    styles.trackerCircle,
                    isCompleted && { backgroundColor: step.color },
                    isActive && styles.trackerCircleActive,
                  ]}>
                    {isCompleted ? (
                      <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                    ) : (
                      <Text style={styles.trackerNumber}>{index + 1}</Text>
                    )}
                  </View>
                  {index < STATUS_STEPS.length - 1 && (
                    <View style={[
                      styles.trackerLine,
                      index < currentStepIndex && { backgroundColor: step.color },
                    ]} />
                  )}
                </View>
                <View style={styles.trackerRight}>
                  <Text style={[
                    styles.trackerStepLabel,
                    isActive && styles.trackerStepLabelActive,
                  ]}>
                    {step.label}
                  </Text>
                  <Text style={styles.trackerStepDesc}>{step.description}</Text>
                  
                  {/* Show date if completed */}
                  {isCompleted && timeline[index] && (
                    <Text style={styles.trackerDate}>
                      {new Date(timeline[index].date).toLocaleDateString()}
                    </Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Text style={styles.actionsTitle}>Available Actions</Text>
          
          {currentStatus === 'registered' && (
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleDocumentUpload}
            >
              <Ionicons name="cloud-upload-outline" size={22} color="#1E3A5F" />
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Upload Documents</Text>
                <Text style={styles.actionDesc}>Submit required documents to proceed</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#8AA0B8" />
            </TouchableOpacity>
          )}

          {currentStatus === 'admission_received' && application?.offerLetter && (
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleViewOfferLetter}
            >
              <Ionicons name="document-text-outline" size={22} color="#27AE60" />
              <View style={styles.actionContent}>
                <Text style={[styles.actionTitle, { color: '#27AE60' }]}>View Offer Letter</Text>
                <Text style={styles.actionDesc}>Your admission letter is ready</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#8AA0B8" />
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleContactCounselor}
          >
            <Ionicons name="chatbubble-outline" size={22} color="#1E3A5F" />
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Contact Your Counselor</Text>
              <Text style={styles.actionDesc}>Get updates or ask questions</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8AA0B8" />
          </TouchableOpacity>
        </View>

        {/* Estimated Timeline */}
        <View style={styles.timelineContainer}>
          <Text style={styles.timelineTitle}>Estimated Timeline</Text>
          <View style={styles.timelineItem}>
            <Ionicons name="time-outline" size={18} color="#5A7D9C" />
            <Text style={styles.timelineText}>
              Document Review: 1-2 business days
            </Text>
          </View>
          <View style={styles.timelineItem}>
            <Ionicons name="time-outline" size={18} color="#5A7D9C" />
            <Text style={styles.timelineText}>
              University Application: 2-4 weeks
            </Text>
          </View>
          <View style={styles.timelineItem}>
            <Ionicons name="time-outline" size={18} color="#5A7D9C" />
            <Text style={styles.timelineText}>
              Admission Decision: 4-8 weeks
            </Text>
          </View>
          <View style={styles.timelineItem}>
            <Ionicons name="time-outline" size={18} color="#5A7D9C" />
            <Text style={styles.timelineText}>
              Visa Processing: 2-4 weeks
            </Text>
          </View>
        </View>

        {/* Need Help Banner */}
        <TouchableOpacity 
          style={styles.helpBanner}
          onPress={handleContactCounselor}
        >
          <Ionicons name="headset-outline" size={24} color="#1E3A5F" />
          <View style={styles.helpContent}>
            <Text style={styles.helpTitle}>Need Assistance?</Text>
            <Text style={styles.helpText}>
              Our counselors are available 24/7 to help you
            </Text>
          </View>
          <View style={styles.helpBadge}>
            <Text style={styles.helpBadgeText}>Chat Now</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#5A7D9C',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EEF5',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E3A5F',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  appIdCard: {
    backgroundColor: '#1E3A5F',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginBottom: 16,
  },
  appIdLabel: {
    fontSize: 13,
    color: '#A8D0E6',
    marginBottom: 4,
  },
  appIdValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  appDate: {
    fontSize: 13,
    color: '#A8D0E6',
    marginTop: 8,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  statusIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  statusContent: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  statusDescription: {
    fontSize: 13,
    color: '#5A7D9C',
  },
  trackerContainer: {
    marginBottom: 24,
  },
  trackerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E3A5F',
    marginBottom: 20,
  },
  trackerStep: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  trackerLeft: {
    alignItems: 'center',
    marginRight: 16,
  },
  trackerCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E8EEF5',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  trackerCircleActive: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#1E3A5F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  trackerNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8AA0B8',
  },
  trackerLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E8EEF5',
    marginVertical: 4,
  },
  trackerRight: {
    flex: 1,
    paddingBottom: 8,
  },
  trackerStepLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#5A7D9C',
    marginBottom: 4,
  },
  trackerStepLabelActive: {
    color: '#1E3A5F',
    fontWeight: '600',
  },
  trackerStepDesc: {
    fontSize: 13,
    color: '#8AA0B8',
    marginBottom: 4,
  },
  trackerDate: {
    fontSize: 12,
    color: '#27AE60',
  },
  actionsContainer: {
    marginBottom: 24,
  },
  actionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E3A5F',
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFCFE',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E8EEF5',
  },
  actionContent: {
    flex: 1,
    marginLeft: 14,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1E3A5F',
    marginBottom: 2,
  },
  actionDesc: {
    fontSize: 12,
    color: '#8AA0B8',
  },
  timelineContainer: {
    backgroundColor: '#F5F9FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  timelineTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E3A5F',
    marginBottom: 12,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  timelineText: {
    fontSize: 13,
    color: '#5A7D9C',
    marginLeft: 12,
  },
  helpBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF3FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 30,
  },
  helpContent: {
    flex: 1,
    marginLeft: 14,
  },
  helpTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E3A5F',
  },
  helpText: {
    fontSize: 12,
    color: '#5A7D9C',
    marginTop: 2,
  },
  helpBadge: {
    backgroundColor: '#1E3A5F',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  helpBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});

export default ApplicationTrackerScreen;
