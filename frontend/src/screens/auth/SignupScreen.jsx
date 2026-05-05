// frontend/src/screens/auth/SignupScreen.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import api from '../../services/api';

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('email'); // 'email' or 'profile'

  const handleEmailContinue = async () => {
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      // Check if user exists
      const response = await api.post('/auth/check-email', { email });
      
      if (response.data.exists) {
        // Returning user - prompt to login
        Alert.alert(
          'Account Exists',
          'Please log in with your existing account.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Go to Login', onPress: () => navigation.navigate('Login') },
          ]
        );
      } else {
        // New user - proceed to profile setup
        setStep('profile');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'profile') {
    return <ProfileStep email={email} navigation={navigation} />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <Text style={styles.logoText}>GISC</Text>
          </View>
          <Text style={styles.brandName}>Global Immigration SC</Text>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          <Text style={styles.title}>
            Your one-stop platform for all things study abroad
          </Text>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email address</Text>
            <TextInput
              style={styles.input}
              placeholder="your.email@example.com"
              placeholderTextColor="#999999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Terms */}
          <Text style={styles.terms}>
            By proceeding, you agree to the{' '}
            <Text style={styles.termsLink}>Terms & Conditions</Text> and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>.
          </Text>

          {/* Continue Button */}
          <TouchableOpacity
            style={[styles.continueButton, loading && styles.buttonDisabled]}
            onPress={handleEmailContinue}
            disabled={loading}
            activeOpacity={0.9}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.continueButtonText}>Continue</Text>
            )}
          </TouchableOpacity>

          {/* Or Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Google Sign-in */}
          <TouchableOpacity style={styles.googleButton} activeOpacity={0.8}>
            <Text style={styles.googleButtonText}>G</Text>
            <Text style={styles.googleButtonLabel}>Continue with Google</Text>
          </TouchableOpacity>
        </View>

        {/* Trust Signals */}
        <View style={styles.trustSection}>
          <View style={styles.trustItem}>
            <Text style={styles.trustStars}>⭐ 4.7/5</Text>
            <Text style={styles.trustLabel}>Google rating</Text>
          </View>
          <View style={styles.trustDivider} />
          <View style={styles.trustItem}>
            <Text style={styles.trustNumber}>500+</Text>
            <Text style={styles.trustLabel}>Students counselled</Text>
          </View>
          <View style={styles.trustDivider} />
          <View style={styles.trustItem}>
            <Text style={styles.trustNumber}>1K+</Text>
            <Text style={styles.trustLabel}>Courses available</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// Profile Step Component (Screenshot 6 pattern)
const ProfileStep = ({ email, navigation }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    country: 'Liberia',
    nationality: 'Liberian',
    phone: '',
    preferredCountry: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleCompleteProfile = async () => {
    if (!formData.fullName || !formData.phone || !formData.preferredCountry || !formData.password) {
      Alert.alert('Incomplete', 'Please fill all required fields.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/register', {
        email,
        ...formData,
      });

      if (response.data.success) {
        await AsyncStorage.setItem('gisc_token', response.data.token);
        await AsyncStorage.setItem('gisc_user', JSON.stringify(response.data.user));
        await AsyncStorage.setItem('gisc_profile_complete', 'false');
        navigation.replace('ProfileSetup');
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.profileContainer} contentContainerStyle={styles.profileContent}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backLink}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.profileTitle}>Academic Dreams</Text>
      <Text style={styles.profileSubtitle}>Complete your profile; it takes just 30 secs!</Text>

      <View style={styles.profileForm}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Full name</Text>
          <Text style={styles.inputHint}>As per your passport or ID proof</Text>
          <TextInput
            style={styles.profileInput}
            value={formData.fullName}
            onChangeText={(t) => setFormData({ ...formData, fullName: t })}
            placeholder="Enter your full name"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Country you live in</Text>
          <TextInput
            style={styles.profileInput}
            value={formData.country}
            onChangeText={(t) => setFormData({ ...formData, country: t })}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Nationality</Text>
          <TextInput
            style={styles.profileInput}
            value={formData.nationality}
            onChangeText={(t) => setFormData({ ...formData, nationality: t })}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Phone number</Text>
          <TextInput
            style={styles.profileInput}
            value={formData.phone}
            onChangeText={(t) => setFormData({ ...formData, phone: t })}
            placeholder="+231 XX XXX XXXX"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Where do you wish to study?</Text>
          <TextInput
            style={styles.profileInput}
            value={formData.preferredCountry}
            onChangeText={(t) => setFormData({ ...formData, preferredCountry: t })}
            placeholder="e.g., Canada, USA, UK"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Set your password</Text>
          <TextInput
            style={styles.profileInput}
            value={formData.password}
            onChangeText={(t) => setFormData({ ...formData, password: t })}
            placeholder="Minimum 6 characters"
            placeholderTextColor="#999"
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={[styles.continueButton, loading && styles.buttonDisabled]}
          onPress={handleCompleteProfile}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.continueButtonText}>Continue</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoIcon: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#cc2936',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  brandName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a3a5c',
    letterSpacing: 0.5,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1a3a5c',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 30,
  },
  inputContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1a3a5c',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  terms: {
    fontSize: 12,
    color: '#888888',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 18,
  },
  termsLink: {
    color: '#1a3a5c',
    fontWeight: '500',
  },
  continueButton: {
    backgroundColor: '#cc2936',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#cc2936',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#888888',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  googleButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4285F4',
    marginRight: 12,
  },
  googleButtonLabel: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
  trustSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
  },
  trustItem: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  trustStars: {
    fontSize: 14,
    color: '#1a3a5c',
    fontWeight: '500',
    marginBottom: 2,
  },
  trustNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a3a5c',
    marginBottom: 2,
  },
  trustLabel: {
    fontSize: 11,
    color: '#888888',
  },
  trustDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#e0e0e0',
  },
  // Profile step styles
  profileContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  profileContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  backLink: {
    fontSize: 16,
    color: '#1a3a5c',
    marginBottom: 24,
  },
  profileTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a3a5c',
    marginBottom: 8,
  },
  profileSubtitle: {
    fontSize: 15,
    color: '#888888',
    marginBottom: 32,
  },
  profileForm: {
    gap: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 4,
  },
  inputHint: {
    fontSize: 12,
    color: '#aaaaaa',
    marginBottom: 8,
  },
  profileInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#1a3a5c',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
});

export default SignupScreen;
