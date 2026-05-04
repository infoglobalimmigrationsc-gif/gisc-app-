// frontend/src/screens/application/ApplicationFormScreen.jsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'https://api.gisc-liberia.com/api';

const STEPS = [
  { id: 1, name: 'Personal', icon: 'person-outline' },
  { id: 2, name: 'Study Plan', icon: 'school-outline' },
  { id: 3, name: 'Education', icon: 'library-outline' },
  { id: 4, name: 'Experience', icon: 'briefcase-outline' },
  { id: 5, name: 'Documents', icon: 'document-text-outline' },
  { id: 6, name: 'Review', icon: 'checkmark-circle-outline' },
];

const ApplicationFormScreen = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1: Personal Info
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    nationality: 'Liberian',
    address: '',
    city: '',
    emergencyContact: '',
    emergencyPhone: '',

    // Step 2: Study Plan
    preferredCountries: [],
    preferredCourses: [],
    intendedStartDate: '',
    studyLevel: '',
    budgetRange: '',

    // Step 3: Education
    highestQualification: '',
    institutionName: '',
    yearOfGraduation: '',
    grade: '',
    englishProficiency: '',
    englishScore: '',

    // Step 4: Experience
    hasWorkExperience: false,
    workExperience: [],
    skills: [],

    // Step 5: Documents (metadata)
    documentsReady: {
      passport: false,
      certificates: false,
      transcript: false,
      cv: false,
      photo: false,
    },
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadSavedApplication();
  }, []);

  const loadSavedApplication = async () => {
    try {
      const saved = await AsyncStorage.getItem('gisc_application_draft');
      if (saved) {
        setFormData(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading draft:', error);
    }
  };

  const saveDraft = async () => {
    try {
      await AsyncStorage.setItem('gisc_application_draft', JSON.stringify(formData));
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!formData.gender) newErrors.gender = 'Gender is required';
      if (!formData.address) newErrors.address = 'Address is required';
      if (!formData.city) newErrors.city = 'City is required';
      if (!formData.emergencyContact) newErrors.emergencyContact = 'Emergency contact is required';
      if (!formData.emergencyPhone) newErrors.emergencyPhone = 'Emergency phone is required';
    }

    if (step === 2) {
      if (formData.preferredCountries.length === 0) {
        newErrors.preferredCountries = 'Select at least one country';
      }
      if (formData.preferredCourses.length === 0) {
        newErrors.preferredCourses = 'Select at least one course';
      }
      if (!formData.intendedStartDate) {
        newErrors.intendedStartDate = 'Select intended start date';
      }
      if (!formData.studyLevel) newErrors.studyLevel = 'Study level is required';
    }

    if (step === 3) {
      if (!formData.highestQualification) {
        newErrors.highestQualification = 'Highest qualification is required';
      }
      if (!formData.institutionName) {
        newErrors.institutionName = 'Institution name is required';
      }
      if (!formData.yearOfGraduation) {
        newErrors.yearOfGraduation = 'Year of graduation is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (validateStep(currentStep)) {
      await saveDraft();
      if (currentStep < 6) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(6)) return;

    Alert.alert(
      'Submit Application',
      'Are you sure you want to submit your application? You won\'t be able to edit after submission.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Submit', 
          style: 'default',
          onPress: async () => {
            setLoading(true);
            try {
              const token = await AsyncStorage.getItem('gisc_token');
              const response = await axios.post(
                `${API_URL}/application/submit`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
              );

              if (response.data.success) {
                await AsyncStorage.removeItem('gisc_application_draft');
                Alert.alert(
                  'Application Submitted! 🎉',
                  'Your application has been successfully submitted. You can track its progress in the Applications tab.',
                  [{ text: 'View Tracker', onPress: () => navigation.navigate('ApplicationTracker') }]
                );
              }
            } catch (error) {
              Alert.alert('Submission Failed', 'Please try again later.');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicatorContainer}>
      {STEPS.map((step, index) => (
        <React.Fragment key={step.id}>
          <TouchableOpacity
            style={styles.stepItem}
            onPress={() => step.id <= currentStep && setCurrentStep(step.id)}
            disabled={step.id > currentStep}
          >
            <View
              style={[
                styles.stepCircle,
                step.id < currentStep && styles.stepCompleted,
                step.id === currentStep && styles.stepActive,
              ]}
            >
              {step.id < currentStep ? (
                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
              ) : (
                <Text
                  style={[
                    styles.stepNumber,
                    step.id === currentStep && styles.stepNumberActive,
                  ]}
                >
                  {step.id}
                </Text>
              )}
            </View>
            <Text
              style={[
                styles.stepName,
                step.id === currentStep && styles.stepNameActive,
              ]}
            >
              {step.name}
            </Text>
          </TouchableOpacity>
          {index < STEPS.length - 1 && (
            <View
              style={[
                styles.stepConnector,
                step.id < currentStep && styles.stepConnectorActive,
              ]}
            />
          )}
        </React.Fragment>
      ))}
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Personal Information</Text>
      
      <View style={styles.inputRow}>
        <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.label}>First Name *</Text>
          <TextInput
            style={[styles.input, errors.firstName && styles.inputError]}
            value={formData.firstName}
            onChangeText={(text) => {
              setFormData({ ...formData, firstName: text });
              setErrors({ ...errors, firstName: null });
            }}
            placeholder="First name"
            placeholderTextColor="#8AA0B8"
          />
          {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
        </View>
        
        <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.label}>Last Name *</Text>
          <TextInput
            style={[styles.input, errors.lastName && styles.inputError]}
            value={formData.lastName}
            onChangeText={(text) => {
              setFormData({ ...formData, lastName: text });
              setErrors({ ...errors, lastName: null });
            }}
            placeholder="Last name"
            placeholderTextColor="#8AA0B8"
          />
          {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
        </View>
      </View>

      <View style={styles.inputRow}>
        <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.label}>Date of Birth *</Text>
          <TextInput
            style={[styles.input, errors.dateOfBirth && styles.inputError]}
            value={formData.dateOfBirth}
            onChangeText={(text) => {
              setFormData({ ...formData, dateOfBirth: text });
              setErrors({ ...errors, dateOfBirth: null });
            }}
            placeholder="DD/MM/YYYY"
            placeholderTextColor="#8AA0B8"
          />
          {errors.dateOfBirth && <Text style={styles.errorText}>{errors.dateOfBirth}</Text>}
        </View>
        
        <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.label}>Gender *</Text>
          <View style={styles.genderContainer}>
            {['Male', 'Female', 'Other'].map((g) => (
              <TouchableOpacity
                key={g}
                style={[
                  styles.genderOption,
                  formData.gender === g && styles.genderOptionSelected,
                ]}
                onPress={() => {
                  setFormData({ ...formData, gender: g });
                  setErrors({ ...errors, gender: null });
                }}
              >
                <Text
                  style={[
                    styles.genderText,
                    formData.gender === g && styles.genderTextSelected,
                  ]}
                >
                  {g}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nationality</Text>
        <TextInput
          style={styles.input}
          value={formData.nationality}
          onChangeText={(text) => setFormData({ ...formData, nationality: text })}
          placeholder="Nationality"
          placeholderTextColor="#8AA0B8"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Residential Address *</Text>
        <TextInput
          style={[styles.input, errors.address && styles.inputError]}
          value={formData.address}
          onChangeText={(text) => {
            setFormData({ ...formData, address: text });
            setErrors({ ...errors, address: null });
          }}
          placeholder="Street address"
          placeholderTextColor="#8AA0B8"
        />
        {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>City *</Text>
        <TextInput
          style={[styles.input, errors.city && styles.inputError]}
          value={formData.city}
          onChangeText={(text) => {
            setFormData({ ...formData, city: text });
            setErrors({ ...errors, city: null });
          }}
          placeholder="City"
          placeholderTextColor="#8AA0B8"
        />
        {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Emergency Contact Name *</Text>
        <TextInput
          style={[styles.input, errors.emergencyContact && styles.inputError]}
          value={formData.emergencyContact}
          onChangeText={(text) => {
            setFormData({ ...formData, emergencyContact: text });
            setErrors({ ...errors, emergencyContact: null });
          }}
          placeholder="Full name"
          placeholderTextColor="#8AA0B8"
        />
        {errors.emergencyContact && <Text style={styles.errorText}>{errors.emergencyContact}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Emergency Contact Phone *</Text>
        <TextInput
          style={[styles.input, errors.emergencyPhone && styles.inputError]}
          value={formData.emergencyPhone}
          onChangeText={(text) => {
            setFormData({ ...formData, emergencyPhone: text });
            setErrors({ ...errors, emergencyPhone: null });
          }}
          placeholder="Phone number"
          keyboardType="phone-pad"
          placeholderTextColor="#8AA0B8"
        />
        {errors.emergencyPhone && <Text style={styles.errorText}>{errors.emergencyPhone}</Text>}
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Study Plan</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Preferred Countries *</Text>
        <View style={styles.chipContainer}>
          {['USA', 'Canada', 'UK', 'Germany', 'France', 'Spain', 'Malta', 'Dubai'].map((country) => (
            <TouchableOpacity
              key={country}
              style={[
                styles.chip,
                formData.preferredCountries.includes(country) && styles.chipSelected,
              ]}
              onPress={() => {
                const countries = formData.preferredCountries.includes(country)
                  ? formData.preferredCountries.filter(c => c !== country)
                  : [...formData.preferredCountries, country];
                setFormData({ ...formData, preferredCountries: countries });
                setErrors({ ...errors, preferredCountries: null });
              }}
            >
              <Text
                style={[
                  styles.chipText,
                  formData.preferredCountries.includes(country) && styles.chipTextSelected,
                ]}
              >
                {country}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.preferredCountries && (
          <Text style={styles.errorText}>{errors.preferredCountries}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Preferred Courses *</Text>
        <TextInput
          style={[styles.input, errors.preferredCourses && styles.inputError]}
          value={formData.preferredCourses.join(', ')}
          onChangeText={(text) => {
            setFormData({ ...formData, preferredCourses: text.split(',').map(s => s.trim()) });
            setErrors({ ...errors, preferredCourses: null });
          }}
          placeholder="e.g., Business, Computer Science"
          placeholderTextColor="#8AA0B8"
        />
        <Text style={styles.hint}>Separate multiple courses with commas</Text>
        {errors.preferredCourses && (
          <Text style={styles.errorText}>{errors.preferredCourses}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Intended Start Date *</Text>
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => {
            Alert.alert(
              'Select Intake',
              'Choose your preferred start date',
              [
                { text: 'Fall 2026 (September)', onPress: () => {
                  setFormData({ ...formData, intendedStartDate: 'Fall 2026' });
                  setErrors({ ...errors, intendedStartDate: null });
                }},
                { text: 'Spring 2027 (January)', onPress: () => {
                  setFormData({ ...formData, intendedStartDate: 'Spring 2027' });
                  setErrors({ ...errors, intendedStartDate: null });
                }},
                { text: 'Fall 2027 (September)', onPress: () => {
                  setFormData({ ...formData, intendedStartDate: 'Fall 2027' });
                  setErrors({ ...errors, intendedStartDate: null });
                }},
                { text: 'Cancel', style: 'cancel' },
              ]
            );
          }}
        >
          <Text style={formData.intendedStartDate ? styles.selectText : styles.selectPlaceholder}>
            {formData.intendedStartDate || 'Select intake'}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#5A7D9C" />
        </TouchableOpacity>
        {errors.intendedStartDate && (
          <Text style={styles.errorText}>{errors.intendedStartDate}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Study Level *</Text>
        {['Diploma', 'Bachelor\'s', 'Master\'s', 'PhD'].map((level) => (
          <TouchableOpacity
            key={level}
            style={[
              styles.radioOption,
              formData.studyLevel === level && styles.radioOptionSelected,
            ]}
            onPress={() => {
              setFormData({ ...formData, studyLevel: level });
              setErrors({ ...errors, studyLevel: null });
            }}
          >
            <View style={[
              styles.radio,
              formData.studyLevel === level && styles.radioSelected,
            ]}>
              {formData.studyLevel === level && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.radioLabel}>{level}</Text>
          </TouchableOpacity>
        ))}
        {errors.studyLevel && <Text style={styles.errorText}>{errors.studyLevel}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Annual Budget Range</Text>
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => {
            Alert.alert(
              'Select Budget Range',
              'Choose your estimated annual budget',
              [
                { text: 'Under $5,000', onPress: () => setFormData({ ...formData, budgetRange: 'Under $5,000' }) },
                { text: '$5,000 - $10,000', onPress: () => setFormData({ ...formData, budgetRange: '$5,000 - $10,000' }) },
                { text: '$10,000 - $20,000', onPress: () => setFormData({ ...formData, budgetRange: '$10,000 - $20,000' }) },
                { text: '$20,000+', onPress: () => setFormData({ ...formData, budgetRange: '$20,000+' }) },
                { text: 'Cancel', style: 'cancel' },
              ]
            );
          }}
        >
          <Text style={formData.budgetRange ? styles.selectText : styles.selectPlaceholder}>
            {formData.budgetRange || 'Select budget range'}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#5A7D9C" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Education History</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Highest Qualification *</Text>
        <TouchableOpacity
          style={[styles.selectButton, errors.highestQualification && styles.inputError]}
          onPress={() => {
            Alert.alert(
              'Select Qualification',
              'Choose your highest qualification',
              [
                { text: 'High School / WAEC', onPress: () => {
                  setFormData({ ...formData, highestQualification: 'High School' });
                  setErrors({ ...errors, highestQualification: null });
                }},
                { text: 'Diploma', onPress: () => {
                  setFormData({ ...formData, highestQualification: 'Diploma' });
                  setErrors({ ...errors, highestQualification: null });
                }},
                { text: 'Bachelor\'s Degree', onPress: () => {
                  setFormData({ ...formData, highestQualification: 'Bachelor\'s' });
                  setErrors({ ...errors, highestQualification: null });
                }},
                { text: 'Master\'s Degree', onPress: () => {
                  setFormData({ ...formData, highestQualification: 'Master\'s' });
                  setErrors({ ...errors, highestQualification: null });
                }},
                { text: 'Cancel', style: 'cancel' },
              ]
            );
          }}
        >
          <Text style={formData.highestQualification ? styles.selectText : styles.selectPlaceholder}>
            {formData.highestQualification || 'Select qualification'}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#5A7D9C" />
        </TouchableOpacity>
        {errors.highestQualification && (
          <Text style={styles.errorText}>{errors.highestQualification}</Text>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Institution Name *</Text>
        <TextInput
          style={[styles.input, errors.institutionName && styles.inputError]}
          value={formData.institutionName}
          onChangeText={(text) => {
            setFormData({ ...formData, institutionName: text });
            setErrors({ ...errors, institutionName: null });
          }}
          placeholder="School/College/University name"
          placeholderTextColor="#8AA0B8"
        />
        {errors.institutionName && <Text style={styles.errorText}>{errors.institutionName}</Text>}
      </View>

      <View style={styles.inputRow}>
        <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.label}>Year of Graduation *</Text>
          <TextInput
            style={[styles.input, errors.yearOfGraduation && styles.inputError]}
            value={formData.yearOfGraduation}
            onChangeText={(text) => {
              setFormData({ ...formData, yearOfGraduation: text });
              setErrors({ ...errors, yearOfGraduation: null });
            }}
            placeholder="YYYY"
            keyboardType="numeric"
            maxLength={4}
            placeholderTextColor="#8AA0B8"
          />
          {errors.yearOfGraduation && (
            <Text style={styles.errorText}>{errors.yearOfGraduation}</Text>
          )}
        </View>
        
        <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.label}>Grade/CGPA</Text>
          <TextInput
            style={styles.input}
            value={formData.grade}
            onChangeText={(text) => setFormData({ ...formData, grade: text })}
            placeholder="e.g., 3.5 GPA"
            placeholderTextColor="#8AA0B8"
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>English Proficiency</Text>
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => {
            Alert.alert(
              'Select English Test',
              'Choose your English proficiency test',
              [
                { text: 'IELTS', onPress: () => setFormData({ ...formData, englishProficiency: 'IELTS' }) },
                { text: 'TOEFL', onPress: () => setFormData({ ...formData, englishProficiency: 'TOEFL' }) },
                { text: 'Duolingo', onPress: () => setFormData({ ...formData, englishProficiency: 'Duolingo' }) },
                { text: 'WAEC English (C6 or better)', onPress: () => setFormData({ ...formData, englishProficiency: 'WAEC' }) },
                { text: 'Not Taken Yet', onPress: () => setFormData({ ...formData, englishProficiency: 'Not Taken' }) },
                { text: 'Cancel', style: 'cancel' },
              ]
            );
          }}
        >
          <Text style={formData.englishProficiency ? styles.selectText : styles.selectPlaceholder}>
            {formData.englishProficiency || 'Select test'}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#5A7D9C" />
        </TouchableOpacity>
      </View>

      {formData.englishProficiency && formData.englishProficiency !== 'WAEC' && formData.englishProficiency !== 'Not Taken' && (
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Test Score</Text>
          <TextInput
            style={styles.input}
            value={formData.englishScore}
            onChangeText={(text) => setFormData({ ...formData, englishScore: text })}
            placeholder="Enter your score"
            placeholderTextColor="#8AA0B8"
          />
        </View>
      )}
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Work Experience</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Do you have work experience?</Text>
        <View style={styles.switchContainer}>
          <TouchableOpacity
            style={[
              styles.switchOption,
              formData.hasWorkExperience && styles.switchOptionSelected,
            ]}
            onPress={() => setFormData({ ...formData, hasWorkExperience: true })}
          >
            <Text style={[
              styles.switchText,
              formData.hasWorkExperience && styles.switchTextSelected,
            ]}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.switchOption,
              !formData.hasWorkExperience && styles.switchOptionSelected,
            ]}
            onPress={() => setFormData({ ...formData, hasWorkExperience: false })}
          >
            <Text style={[
              styles.switchText,
              !formData.hasWorkExperience && styles.switchTextSelected,
            ]}>No</Text>
          </TouchableOpacity>
        </View>
      </View>

      {formData.hasWorkExperience && (
        <>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              const newExperience = [...formData.workExperience, {
                company: '',
                position: '',
                startDate: '',
                endDate: '',
                description: '',
              }];
              setFormData({ ...formData, workExperience: newExperience });
            }}
          >
            <Ionicons name="add-circle" size={20} color="#1E3A5F" />
            <Text style={styles.addButtonText}>Add Work Experience</Text>
          </TouchableOpacity>

          {formData.workExperience.map((exp, index) => (
            <View key={index} style={styles.experienceCard}>
              <View style={styles.experienceHeader}>
                <Text style={styles.experienceTitle}>Position {index + 1}</Text>
                <TouchableOpacity
                  onPress={() => {
                    const newExp = formData.workExperience.filter((_, i) => i !== index);
                    setFormData({ ...formData, workExperience: newExp });
                  }}
                >
                  <Ionicons name="trash-outline" size={20} color="#E74C3C" />
                </TouchableOpacity>
              </View>
              
              <TextInput
                style={styles.experienceInput}
                value={exp.company}
                onChangeText={(text) => {
                  const newExp = [...formData.workExperience];
                  newExp[index].company = text;
                  setFormData({ ...formData, workExperience: newExp });
                }}
                placeholder="Company/Organization"
                placeholderTextColor="#8AA0B8"
              />
              
              <TextInput
                style={styles.experienceInput}
                value={exp.position}
                onChangeText={(text) => {
                  const newExp = [...formData.workExperience];
                  newExp[index].position = text;
                  setFormData({ ...formData, workExperience: newExp });
                }}
                placeholder="Job Title"
                placeholderTextColor="#8AA0B8"
              />
              
              <View style={styles.inputRow}>
                <TextInput
                  style={[styles.experienceInput, { flex: 1, marginRight: 8 }]}
                  value={exp.startDate}
                  onChangeText={(text) => {
                    const newExp = [...formData.workExperience];
                    newExp[index].startDate = text;
                    setFormData({ ...formData, workExperience: newExp });
                  }}
                  placeholder="Start Date"
                  placeholderTextColor="#8AA0B8"
                />
                
                <TextInput
                  style={[styles.experienceInput, { flex: 1, marginLeft: 8 }]}
                  value={exp.endDate}
                  onChangeText={(text) => {
                    const newExp = [...formData.workExperience];
                    newExp[index].endDate = text;
                    setFormData({ ...formData, workExperience: newExp });
                  }}
                  placeholder="End Date (or Present)"
                  placeholderTextColor="#8AA0B8"
                />
              </View>
              
              <TextInput
                style={[styles.experienceInput, styles.textArea]}
                value={exp.description}
                onChangeText={(text) => {
                  const newExp = [...formData.workExperience];
                  newExp[index].description = text;
                  setFormData({ ...formData, workExperience: newExp });
                }}
                placeholder="Brief description of responsibilities"
                placeholderTextColor="#8AA0B8"
                multiline
                numberOfLines={3}
              />
            </View>
          ))}
        </>
      )}

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Skills (optional)</Text>
        <TextInput
          style={styles.input}
          value={formData.skills.join(', ')}
          onChangeText={(text) => {
            setFormData({ ...formData, skills: text.split(',').map(s => s.trim()) });
          }}
          placeholder="e.g., Microsoft Office, Programming, Communication"
          placeholderTextColor="#8AA0B8"
        />
        <Text style={styles.hint}>Separate skills with commas</Text>
      </View>
    </View>
  );

  const renderStep5 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Required Documents</Text>
      <Text style={styles.stepSubtitle}>
        Please confirm you have the following documents ready to upload
      </Text>

      <View style={styles.documentsList}>
        {[
          { key: 'passport', label: 'International Passport', icon: 'id-card-outline' },
          { key: 'certificates', label: 'Academic Certificates', icon: 'document-text-outline' },
          { key: 'transcript', label: 'Academic Transcript', icon: 'document-outline' },
          { key: 'cv', label: 'CV/Resume', icon: 'briefcase-outline' },
          { key: 'photo', label: 'Passport Photograph', icon: 'camera-outline' },
        ].map((doc) => (
          <TouchableOpacity
            key={doc.key}
            style={styles.documentItem}
            onPress={() => {
              setFormData({
                ...formData,
                documentsReady: {
                  ...formData.documentsReady,
                  [doc.key]: !formData.documentsReady[doc.key],
                },
              });
            }}
          >
            <View style={styles.documentLeft}>
              <Ionicons name={doc.icon} size={24} color="#1E3A5F" />
              <Text style={styles.documentLabel}>{doc.label}</Text>
            </View>
            <View style={[
              styles.documentCheckbox,
              formData.documentsReady[doc.key] && styles.documentCheckboxChecked,
            ]}>
              {formData.documentsReady[doc.key] && (
                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.uploadNote}>
        <Ionicons name="information-circle-outline" size={20} color="#F39C12" />
        <Text style={styles.uploadNoteText}>
          You can upload these documents after submitting your application in the Documents section.
        </Text>
      </View>
    </View>
  );

  const renderStep6 = () => (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Review Your Application</Text>
      <Text style={styles.stepSubtitle}>
        Please review all information before submitting
      </Text>

      <View style={styles.reviewSection}>
        <View style={styles.reviewHeader}>
          <Text style={styles.reviewTitle}>Personal Information</Text>
          <TouchableOpacity onPress={() => setCurrentStep(1)}>
            <Text style={styles.editLink}>Edit</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.reviewText}>Name: {formData.firstName} {formData.lastName}</Text>
        <Text style={styles.reviewText}>DOB: {formData.dateOfBirth}</Text>
        <Text style={styles.reviewText}>Gender: {formData.gender}</Text>
        <Text style={styles.reviewText}>Address: {formData.address}, {formData.city}</Text>
        <Text style={styles.reviewText}>Emergency: {formData.emergencyContact} ({formData.emergencyPhone})</Text>
      </View>

      <View style={styles.reviewSection}>
        <View style={styles.reviewHeader}>
          <Text style={styles.reviewTitle}>Study Plan</Text>
          <TouchableOpacity onPress={() => setCurrentStep(2)}>
            <Text style={styles.editLink}>Edit</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.reviewText}>Countries: {formData.preferredCountries.join(', ')}</Text>
        <Text style={styles.reviewText}>Courses: {formData.preferredCourses.join(', ')}</Text>
        <Text style={styles.reviewText}>Start Date: {formData.intendedStartDate}</Text>
        <Text style={styles.reviewText}>Study Level: {formData.studyLevel}</Text>
        <Text style={styles.reviewText}>Budget: {formData.budgetRange || 'Not specified'}</Text>
      </View>

      <View style={styles.reviewSection}>
        <View style={styles.reviewHeader}>
          <Text style={styles.reviewTitle}>Education</Text>
          <TouchableOpacity onPress={() => setCurrentStep(3)}>
            <Text style={styles.editLink}>Edit</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.reviewText}>Qualification: {formData.highestQualification}</Text>
        <Text style={styles.reviewText}>Institution: {formData.institutionName}</Text>
        <Text style={styles.reviewText}>Year: {formData.yearOfGraduation}</Text>
        <Text style={styles.reviewText}>English: {formData.englishProficiency} {formData.englishScore}</Text>
      </View>

      <View style={styles.reviewSection}>
        <View style={styles.reviewHeader}>
          <Text style={styles.reviewTitle}>Work Experience</Text>
          <TouchableOpacity onPress={() => setCurrentStep(4)}>
            <Text style={styles.editLink}>Edit</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.reviewText}>
          {formData.hasWorkExperience 
            ? `${formData.workExperience.length} position(s) listed`
            : 'No work experience'}
        </Text>
      </View>

      <View style={styles.declarationContainer}>
        <TouchableOpacity
          style={styles.declarationCheck}
          onPress={() => {
            // Toggle declaration
          }}
        >
          <Ionicons name="checkbox-outline" size={20} color="#1E3A5F" />
        </TouchableOpacity>
        <Text style={styles.declarationText}>
          I confirm that all information provided is accurate and complete to the best of my knowledge.
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="#1E3A5F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Application Form</Text>
        <TouchableOpacity onPress={saveDraft}>
          <Text style={styles.saveDraft}>Save Draft</Text>
        </TouchableOpacity>
      </View>

      {/* Step Indicator */}
      {renderStepIndicator()}

      {/* Form Content */}
      <ScrollView 
        style={styles.formContainer}
        showsVerticalScrollIndicator={false}
      >
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
        {currentStep === 5 && renderStep5()}
        {currentStep === 6 && renderStep6()}
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.navigationButtons}>
        {currentStep > 1 && (
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}
        
        {currentStep < 6 ? (
          <TouchableOpacity 
            style={[styles.nextButton, currentStep === 1 && styles.nextButtonFull]}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>
              {currentStep === 5 ? 'Continue to Review' : 'Next'}
            </Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>Submit Application</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  saveDraft: {
    fontSize: 14,
    color: '#1E3A5F',
    fontWeight: '500',
  },
  stepIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FAFCFE',
  },
  stepItem: {
    alignItems: 'center',
    width: 50,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E8EEF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  stepCompleted: {
    backgroundColor: '#27AE60',
  },
  stepActive: {
    backgroundColor: '#1E3A5F',
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8AA0B8',
  },
  stepNumberActive: {
    color: '#FFFFFF',
  },
  stepName: {
    fontSize: 9,
    color: '#8AA0B8',
    textAlign: 'center',
  },
  stepNameActive: {
    color: '#1E3A5F',
    fontWeight: '500',
  },
  stepConnector: {
    flex: 1,
    height: 2,
    backgroundColor: '#E8EEF5',
    marginHorizontal: 4,
  },
  stepConnectorActive: {
    backgroundColor: '#27AE60',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stepContent: {
    paddingVertical: 20,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E3A5F',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 14,
    color: '#5A7D9C',
    marginBottom: 24,
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E3A5F',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FAFCFE',
    borderWidth: 1.5,
    borderColor: '#D0DDE9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#1E3A5F',
  },
  inputError: {
    borderColor: '#E74C3C',
  },
  errorText: {
    fontSize: 12,
    color: '#E74C3C',
    marginTop: 6,
  },
  hint: {
    fontSize: 12,
    color: '#8AA0B8',
    marginTop: 6,
  },
  inputRow: {
    flexDirection: 'row',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderOption: {
    flex: 1,
    backgroundColor: '#FAFCFE',
    borderWidth: 1.5,
    borderColor: '#D0DDE9',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  genderOptionSelected: {
    backgroundColor: '#1E3A5F',
    borderColor: '#1E3A5F',
  },
  genderText: {
    fontSize: 14,
    color: '#5A7D9C',
  },
  genderTextSelected: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  chip: {
    backgroundColor: '#FAFCFE',
    borderWidth: 1.5,
    borderColor: '#D0DDE9',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    margin: 4,
  },
  chipSelected: {
    backgroundColor: '#1E3A5F',
    borderColor: '#1E3A5F',
  },
  chipText: {
    fontSize: 13,
    color: '#5A7D9C',
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  selectButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FAFCFE',
    borderWidth: 1.5,
    borderColor: '#D0DDE9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  selectText: {
    fontSize: 15,
    color: '#1E3A5F',
  },
  selectPlaceholder: {
    fontSize: 15,
    color: '#8AA0B8',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  radioOptionSelected: {
    backgroundColor: '#F5F9FF',
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
  radioSelected: {
    borderColor: '#1E3A5F',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1E3A5F',
  },
  radioLabel: {
    fontSize: 15,
    color: '#1E3A5F',
  },
  switchContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F9FF',
    borderRadius: 12,
    padding: 4,
  },
  switchOption: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  switchOptionSelected: {
    backgroundColor: '#1E3A5F',
  },
  switchText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#5A7D9C',
  },
  switchTextSelected: {
    color: '#FFFFFF',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F9FF',
    borderWidth: 1,
    borderColor: '#1E3A5F',
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 16,
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1E3A5F',
    marginLeft: 8,
  },
  experienceCard: {
    backgroundColor: '#FAFCFE',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E8EEF5',
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  experienceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E3A5F',
  },
  experienceInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D0DDE9',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1E3A5F',
    marginBottom: 10,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  documentsList: {
    marginBottom: 20,
  },
  documentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FAFCFE',
    borderWidth: 1,
    borderColor: '#E8EEF5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  documentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  documentLabel: {
    fontSize: 15,
    color: '#1E3A5F',
    marginLeft: 14,
  },
  documentCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D0DDE9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  documentCheckboxChecked: {
    backgroundColor: '#27AE60',
    borderColor: '#27AE60',
  },
  uploadNote: {
    flexDirection: 'row',
    backgroundColor: '#FEF9E7',
    borderRadius: 12,
    padding: 16,
    alignItems: 'flex-start',
  },
  uploadNoteText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 13,
    color: '#5A7D9C',
    lineHeight: 18,
  },
  reviewSection: {
    backgroundColor: '#FAFCFE',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E8EEF5',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E3A5F',
  },
  editLink: {
    fontSize: 14,
    color: '#1E3A5F',
    fontWeight: '500',
  },
  reviewText: {
    fontSize: 14,
    color: '#5A7D9C',
    marginBottom: 6,
  },
  declarationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
    marginBottom: 20,
  },
  declarationCheck: {
    marginRight: 12,
    marginTop: 2,
  },
  declarationText: {
    flex: 1,
    fontSize: 13,
    color: '#5A7D9C',
    lineHeight: 18,
  },
  navigationButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E8EEF5',
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginRight: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#D0DDE9',
  },
  backButtonText: {
    fontSize: 15,
    color: '#5A7D9C',
  },
  nextButton: {
    flex: 1,
    backgroundColor: '#1E3A5F',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonFull: {
    flex: 1,
    marginLeft: 0,
  },
  nextButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#27AE60',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default ApplicationFormScreen;
