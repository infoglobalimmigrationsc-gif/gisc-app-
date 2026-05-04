// frontend/src/screens/auth/ProfileSetupScreen.jsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://api.gisc-liberia.com/api';

const COUNTRIES = [
  { label: 'United States', value: 'usa' },
  { label: 'Canada', value: 'canada' },
  { label: 'United Kingdom', value: 'uk' },
  { label: 'Germany', value: 'germany' },
  { label: 'France', value: 'france' },
  { label: 'Spain', value: 'spain' },
  { label: 'Malta', value: 'malta' },
  { label: 'Dubai (UAE)', value: 'uae' },
  { label: 'Australia', value: 'australia' },
  { label: 'Ireland', value: 'ireland' },
];

const COURSES = [
  'Business Administration',
  'Computer Science',
  'Engineering',
  'Medicine',
  'Nursing',
  'Data Science',
  'Finance',
  'Marketing',
  'International Relations',
  'Law',
  'Hospitality Management',
  'Information Technology',
  'Public Health',
  'Accounting',
];

const STUDY_LEVELS = [
  { label: 'Diploma / Certificate', value: 'diploma' },
  { label: 'Bachelor\'s Degree', value: 'bachelor' },
  { label: 'Postgraduate Diploma', value: 'pgd' },
  { label: 'Master\'s Degree', value: 'master' },
  { label: 'PhD / Doctorate', value: 'phd' },
];

const BUDGET_RANGES = [
  { label: 'Under $5,000 per year', value: 'under_5k' },
  { label: '$5,000 - $10,000 per year', value: '5k_10k' },
  { label: '$10,000 - $20,000 per year', value: '10k_20k' },
  { label: '$20,000 - $30,000 per year', value: '20k_30k' },
  { label: 'Above $30,000 per year', value: 'above_30k' },
  { label: 'Looking for Full Scholarship', value: 'scholarship' },
];

const ProfileSetupScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    preferredCountry: '',
    courseOfStudy: '',
    studyLevel: '',
    budgetRange: '',
    passportStatus: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showCoursePicker, setShowCoursePicker] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const filledFields = Object.values(formData).filter(v => v).length;
    setProgress((filledFields / 5) * 100);
  }, [formData]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.preferredCountry) {
      newErrors.preferredCountry = 'Please select your preferred country';
    }
    if (!formData.courseOfStudy) {
      newErrors.courseOfStudy = 'Please select your course of study';
    }
    if (!formData.studyLevel) {
      newErrors.studyLevel = 'Please select your study level';
    }
    if (!formData.budgetRange) {
      newErrors.budgetRange = 'Please select your budget range';
    }
    if (!formData.passportStatus) {
      newErrors.passportStatus = 'Please select your passport status';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Incomplete Profile', 'Please fill all fields to continue.');
      return;
    }
    
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('gisc_token');
      
      const response = await axios.post(
        `${API_URL}/profile/setup`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        await AsyncStorage.setItem('gisc_profile_complete', 'true');
        
        Alert.alert(
          'Profile Complete! 🎉',
          'Your profile is all set. We\'ll personalize your dashboard based on your preferences.',
          [{ text: 'Continue to Dashboard', onPress: () => navigation.replace('Home') }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    Alert.alert(
      'Skip for Now?',
      'You can always complete your profile later. However, completing it now helps us provide better recommendations.',
      [
        { text: 'Complete Now', style: 'cancel' },
        { text: 'Skip', onPress: () => navigation.replace('Home') },
      ]
    );
  };

  const getSelectedCountryLabel = () => {
    const country = COUNTRIES.find(c => c.value === formData.preferredCountry);
    return country ? country.label : 'Select your preferred country';
  };

  const getSelectedLevelLabel = () => {
    const level = STUDY_LEVELS.find(l => l.value === formData.studyLevel);
    return level ? level.label : 'Select your study level';
  };

  const getSelectedBudgetLabel = () => {
    const budget = BUDGET_RANGES.find(b => b.value === formData.budgetRange);
    return budget ? budget.label : 'Select your budget range';
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Complete Your Profile</Text>
        <Text style={styles.subtitle}>
          Help us personalize your study abroad experience
        </Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>{Math.round(progress)}% Complete</Text>
      </View>

      <View style={styles.form}>
        {/* Preferred Country */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Preferred Country <Text style={styles.required}>*</Text>
          </Text>
          <TouchableOpacity
            style={[styles.selectButton, errors.preferredCountry && styles.selectError]}
            onPress={() => setShowCountryPicker(true)}
          >
            <Text style={formData.preferredCountry ? styles.selectText : styles.selectPlaceholder}>
              {getSelectedCountryLabel()}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#5A7D9C" />
          </TouchableOpacity>
          {errors.preferredCountry && (
            <Text style={styles.errorText}>{errors.preferredCountry}</Text>
          )}
        </View>

        {/* Course of Study */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Course of Study <Text style={styles.required}>*</Text>
          </Text>
          <TouchableOpacity
            style={[styles.selectButton, errors.courseOfStudy && styles.selectError]}
            onPress={() => setShowCoursePicker(true)}
          >
            <Text style={formData.courseOfStudy ? styles.selectText : styles.selectPlaceholder}>
              {formData.courseOfStudy || 'Select your course'}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#5A7D9C" />
          </TouchableOpacity>
          {errors.courseOfStudy && (
            <Text style={styles.errorText}>{errors.courseOfStudy}</Text>
          )}
        </View>

        {/* Study Level */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Study Level <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.levelContainer}>
            {STUDY_LEVELS.map((level) => (
              <TouchableOpacity
                key={level.value}
                style={[
                  styles.levelChip,
                  formData.studyLevel === level.value && styles.levelChipSelected,
                ]}
                onPress={() => {
                  setFormData({ ...formData, studyLevel: level.value });
                  setErrors({ ...errors, studyLevel: null });
                }}
              >
                <Text
                  style={[
                    styles.levelChipText,
                    formData.studyLevel === level.value && styles.levelChipTextSelected,
                  ]}
                >
                  {level.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.studyLevel && (
            <Text style={styles.errorText}>{errors.studyLevel}</Text>
          )}
        </View>

        {/* Budget Range */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Annual Budget <Text style={styles.required}>*</Text>
          </Text>
          <TouchableOpacity
            style={[styles.selectButton, errors.budgetRange && styles.selectError]}
            onPress={() => {
              Alert.alert(
                'Select Budget Range',
                'Choose your estimated annual budget',
                BUDGET_RANGES.map(budget => ({
                  text: budget.label,
                  onPress: () => {
                    setFormData({ ...formData, budgetRange: budget.value });
                    setErrors({ ...errors, budgetRange: null });
                  },
                }))
              );
            }}
          >
            <Text style={formData.budgetRange ? styles.selectText : styles.selectPlaceholder}>
              {getSelectedBudgetLabel()}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#5A7D9C" />
          </TouchableOpacity>
          {errors.budgetRange && (
            <Text style={styles.errorText}>{errors.budgetRange}</Text>
          )}
        </View>

        {/* Passport Status */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Passport Status <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.passportContainer}>
            {[
              { label: 'I have a valid passport', value: 'yes', color: '#27AE60' },
              { label: 'Passport in progress', value: 'in_progress', color: '#F39C12' },
              { label: 'No passport yet', value: 'no', color: '#E74C3C' },
            ].map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.passportOption,
                  formData.passportStatus === option.value && {
                    borderColor: option.color,
                    backgroundColor: `${option.color}10`,
                  },
                ]}
                onPress={() => {
                  setFormData({ ...formData, passportStatus: option.value });
                  setErrors({ ...errors, passportStatus: null });
                }}
              >
                <View
                  style={[
                    styles.radio,
                    formData.passportStatus === option.value && {
                      borderColor: option.color,
                      backgroundColor: option.color,
                    },
                  ]}
                >
                  {formData.passportStatus === option.value && (
                    <View style={styles.radioInner} />
                  )}
                </View>
                <Text style={styles.passportLabel}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.passportStatus && (
            <Text style={styles.errorText}>{errors.passportStatus}</Text>
          )}
        </View>
      </View>

      <View style={styles.infoBox}>
        <Ionicons name="information-circle-outline" size={20} color="#1E3A5F" />
        <Text style={styles.infoText}>
          This information helps us match you with the best universities and scholarship opportunities.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>Save & Continue</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>Skip for now</Text>
        </TouchableOpacity>
      </View>

      {/* Country Picker Modal */}
      {showCountryPicker && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Country</Text>
              <TouchableOpacity onPress={() => setShowCountryPicker(false)}>
                <Ionicons name="close" size={24} color="#1E3A5F" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList}>
              {COUNTRIES.map((country) => (
                <TouchableOpacity
                  key={country.value}
                  style={styles.modalItem}
                  onPress={() => {
                    setFormData({ ...formData, preferredCountry: country.value });
                    setErrors({ ...errors, preferredCountry: null });
                    setShowCountryPicker(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{country.label}</Text>
                  {formData.preferredCountry === country.value && (
                    <Ionicons name="checkmark" size={20} color="#1E3A5F" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      {/* Course Picker Modal */}
      {showCoursePicker && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Course</Text>
              <TouchableOpacity onPress={() => setShowCoursePicker(false)}>
                <Ionicons name="close" size={24} color="#1E3A5F" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalList}>
              {COURSES.map((course) => (
                <TouchableOpacity
                  key={course}
                  style={styles.modalItem}
                  onPress={() => {
                    setFormData({ ...formData, courseOfStudy: course });
                    setErrors({ ...errors, courseOfStudy: null });
                    setShowCoursePicker(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{course}</Text>
                  {formData.courseOfStudy === course && (
                    <Ionicons name="checkmark" size={20} color="#1E3A5F" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E3A5F',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#5A7D9C',
    lineHeight: 22,
  },
  progressContainer: {
    marginBottom: 32,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E8EEF5',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: 6,
    backgroundColor: '#1E3A5F',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 13,
    color: '#5A7D9C',
    textAlign: 'right',
  },
  form: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E3A5F',
    marginBottom: 8,
  },
  required: {
    color: '#E74C3C',
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: '#D0DDE9',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    backgroundColor: '#FAFCFE',
  },
  selectError: {
    borderColor: '#E74C3C',
  },
  selectText: {
    fontSize: 16,
    color: '#1E3A5F',
  },
  selectPlaceholder: {
    fontSize: 16,
    color: '#8AA0B8',
  },
  errorText: {
    fontSize: 12,
    color: '#E74C3C',
    marginTop: 6,
    marginLeft: 4,
  },
  levelContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  levelChip: {
    borderWidth: 1.5,
    borderColor: '#D0DDE9',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    margin: 4,
    backgroundColor: '#FAFCFE',
  },
  levelChipSelected: {
    backgroundColor: '#1E3A5F',
    borderColor: '#1E3A5F',
  },
  levelChipText: {
    fontSize: 14,
    color: '#5A7D9C',
  },
  levelChipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  passportContainer: {
    marginTop: 4,
  },
  passportOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#D0DDE9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
    backgroundColor: '#FAFCFE',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D0DDE9',
    marginRight: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  passportLabel: {
    fontSize: 15,
    color: '#1E3A5F',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#EBF3FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 28,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 13,
    color: '#1E3A5F',
    lineHeight: 18,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: '#1E3A5F',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#1E3A5F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 14,
    color: '#8AA0B8',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EEF5',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E3A5F',
  },
  modalList: {
    paddingVertical: 8,
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  modalItemText: {
    fontSize: 16,
    color: '#1E3A5F',
  },
});

export default ProfileSetupScreen;
