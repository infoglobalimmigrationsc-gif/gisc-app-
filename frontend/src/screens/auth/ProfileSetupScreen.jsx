// frontend/src/screens/auth/ProfileSetupScreen.jsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';

const COUNTRIES = [
  'Canada', 'United States', 'United Kingdom', 'Germany', 
  'France', 'Spain', 'Malta', 'Dubai (UAE)', 'Australia', 'Ireland'
];

const COURSES = [
  'Business Administration', 'Computer Science', 'Engineering',
  'Medicine', 'Nursing', 'Data Science', 'Finance', 'Marketing',
  'International Relations', 'Law', 'Hospitality Management',
  'Information Technology', 'Public Health', 'Accounting'
];

const STUDY_LEVELS = [
  'Diploma / Certificate', 
  'Undergraduate (Bachelor\'s)',
  'Postgraduate Diploma', 
  'Master\'s Degree', 
  'PhD / Doctorate'
];

const ProfileSetupScreen = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    preferredCountry: '',
    courseOfStudy: '',
    studyLevel: '',
    budgetRange: '',
    passportStatus: '',
  });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const filled = Object.values(formData).filter(v => v).length;
    setProgress((filled / 5) * 100);
  }, [formData]);

  const handleComplete = async () => {
    if (!formData.preferredCountry || !formData.courseOfStudy || !formData.studyLevel) {
      Alert.alert('Incomplete', 'Please fill all required fields.');
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('gisc_token');
      await api.post('/profile/setup', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      await AsyncStorage.setItem('gisc_profile_complete', 'true');
      navigation.replace('Main');
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <View>
      <Text style={styles.stepTitle}>Where do you wish to study?</Text>
      <Text style={styles.stepSubtitle}>Select your preferred destination</Text>
      
      <View style={styles.countryGrid}>
        {COUNTRIES.map((country) => (
          <TouchableOpacity
            key={country}
            style={[
              styles.countryChip,
              formData.preferredCountry === country && styles.countryChipSelected,
            ]}
            onPress={() => {
              setFormData({ ...formData, preferredCountry: country });
              setStep(2);
            }}
          >
            <Text style={[
              styles.countryChipText,
              formData.preferredCountry === country && styles.countryChipTextSelected,
            ]}>
              {country}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View>
      <TouchableOpacity onPress={() => setStep(1)}>
        <Text style={styles.backLink}>← Back</Text>
      </TouchableOpacity>
      
      <Text style={styles.stepTitle}>What do you want to study?</Text>
      <Text style={styles.stepSubtitle}>Select your preferred course</Text>
      
      <View style={styles.courseList}>
        {COURSES.map((course) => (
          <TouchableOpacity
            key={course}
            style={[
              styles.courseOption,
              formData.courseOfStudy === course && styles.courseOptionSelected,
            ]}
            onPress={() => {
              setFormData({ ...formData, courseOfStudy: course });
              setStep(3);
            }}
          >
            <Text style={[
              styles.courseOptionText,
              formData.courseOfStudy === course && styles.courseOptionTextSelected,
            ]}>
              {course}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View>
      <TouchableOpacity onPress={() => setStep(2)}>
        <Text style={styles.backLink}>← Back</Text>
      </TouchableOpacity>
      
      <Text style={styles.stepTitle}>Your study level?</Text>
      <Text style={styles.stepSubtitle}>Select your intended qualification</Text>
      
      {STUDY_LEVELS.map((level) => (
        <TouchableOpacity
          key={level}
          style={[
            styles.levelOption,
            formData.studyLevel === level && styles.levelOptionSelected,
          ]}
          onPress={() => {
            setFormData({ ...formData, studyLevel: level });
            setStep(4);
          }}
        >
          <View style={[
            styles.radio,
            formData.studyLevel === level && styles.radioSelected,
          ]}>
            {formData.studyLevel === level && <View style={styles.radioInner} />}
          </View>
          <Text style={styles.levelText}>{level}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderStep4 = () => (
    <View>
      <TouchableOpacity onPress={() => setStep(3)}>
        <Text style={styles.backLink}>← Back</Text>
      </TouchableOpacity>
      
      <Text style={styles.stepTitle}>Your annual budget?</Text>
      <Text style={styles.stepSubtitle}>This helps us find the best options for you</Text>
      
      {[
        { label: 'Under $5,000 / year', value: 'under_5k' },
        { label: '$5,000 - $10,000 / year', value: '5k_10k' },
        { label: '$10,000 - $20,000 / year', value: '10k_20k' },
        { label: '$20,000 - $30,000 / year', value: '20k_30k' },
        { label: 'Above $30,000 / year', value: 'above_30k' },
        { label: 'Looking for Full Scholarship', value: 'scholarship', highlight: true },
      ].map((budget) => (
        <TouchableOpacity
          key={budget.value}
          style={[
            styles.budgetOption,
            formData.budgetRange === budget.value && styles.budgetOptionSelected,
            budget.highlight && styles.budgetOptionHighlight,
          ]}
          onPress={() => {
            setFormData({ ...formData, budgetRange: budget.value });
            setStep(5);
          }}
        >
          <Text style={[
            styles.budgetText,
            formData.budgetRange === budget.value && styles.budgetTextSelected,
            budget.highlight && styles.budgetTextHighlight,
          ]}>
            {budget.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderStep5 = () => (
    <View>
      <TouchableOpacity onPress={() => setStep(4)}>
        <Text style={styles.backLink}>← Back</Text>
      </TouchableOpacity>
      
      <Text style={styles.stepTitle}>Passport status?</Text>
      <Text style={styles.stepSubtitle}>This helps us prioritize your application</Text>
      
      {[
        { label: 'I have a valid passport', value: 'yes', color: '#27AE60', icon: '✅' },
        { label: 'Passport in progress', value: 'in_progress', color: '#F39C12', icon: '⏳' },
        { label: 'No passport yet', value: 'no', color: '#E74C3C', icon: '❌' },
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
          onPress={() => setFormData({ ...formData, passportStatus: option.value })}
        >
          <Text style={styles.passportIcon}>{option.icon}</Text>
          <Text style={styles.passportLabel}>{option.label}</Text>
          {formData.passportStatus === option.value && (
            <View style={[styles.passportCheck, { backgroundColor: option.color }]}>
              <Text style={styles.passportCheckText}>✓</Text>
            </View>
          )}
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[styles.completeButton, loading && styles.buttonDisabled]}
        onPress={handleComplete}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.completeButtonText}>Complete Profile →</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header with progress */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Academic Dreams</Text>
        <Text style={styles.headerSubtitle}>Complete your profile; it takes just 30 secs!</Text>
        
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>Step {step} of 5</Text>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
        {step === 5 && renderStep5()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#1a3a5c',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#c0c0c0',
    marginBottom: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: 4,
    backgroundColor: '#cc2936',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#c0c0c0',
    textAlign: 'right',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a3a5c',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 15,
    color: '#888888',
    marginBottom: 28,
  },
  backLink: {
    fontSize: 15,
    color: '#1a3a5c',
    marginBottom: 20,
    fontWeight: '500',
  },
  countryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  countryChip: {
    width: '47%',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 14,
    margin: 6,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
  },
  countryChipSelected: {
    backgroundColor: '#1a3a5c',
    borderColor: '#1a3a5c',
  },
  countryChipText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333333',
    textAlign: 'center',
  },
  countryChipTextSelected: {
    color: '#ffffff',
  },
  courseList: {
    gap: 8,
  },
  courseOption: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
  },
  courseOptionSelected: {
    backgroundColor: '#1a3a5c',
    borderColor: '#1a3a5c',
  },
  courseOptionText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333333',
  },
  courseOptionTextSelected: {
    color: '#ffffff',
  },
  levelOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
  },
  levelOptionSelected: {
    backgroundColor: '#1a3a5c',
    borderColor: '#1a3a5c',
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#c0c0c0',
    marginRight: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: '#cc2936',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#cc2936',
  },
  levelText: {
    fontSize: 15,
    color: '#333333',
    fontWeight: '500',
  },
  budgetOption: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
  },
  budgetOptionSelected: {
    backgroundColor: '#1a3a5c',
    borderColor: '#1a3a5c',
  },
  budgetOptionHighlight: {
    borderColor: '#cc2936',
    borderStyle: 'dashed',
  },
  budgetText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333333',
  },
  budgetTextSelected: {
    color: '#ffffff',
  },
  budgetTextHighlight: {
    color: '#cc2936',
    fontWeight: '600',
  },
  passportOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
  },
  passportIcon: {
    fontSize: 24,
    marginRight: 14,
  },
  passportLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#1a3a5c',
  },
  passportCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  passportCheckText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  completeButton: {
    backgroundColor: '#cc2936',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#cc2936',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  completeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileSetupScreen;
