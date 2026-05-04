// frontend/src/screens/auth/LoginScreen.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://api.gisc-liberia.com/api';

const LoginScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: formData.email,
        password: formData.password,
      });
      
      if (response.data.success) {
        await AsyncStorage.setItem('gisc_token', response.data.token);
        await AsyncStorage.setItem('gisc_user', JSON.stringify(response.data.user));
        
        if (rememberMe) {
          await AsyncStorage.setItem('gisc_saved_email', formData.email);
        }
        
        const profileComplete = response.data.user.profileCompleted;
        await AsyncStorage.setItem('gisc_profile_complete', String(profileComplete));
        
        if (profileComplete) {
          navigation.replace('Home');
        } else {
          navigation.replace('ProfileSetup');
        }
      }
    } catch (error) {
      Alert.alert(
        'Login Failed',
        error.response?.data?.message || 'Invalid email or password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Load saved email on mount
  React.useEffect(() => {
    const loadSavedEmail = async () => {
      const savedEmail = await AsyncStorage.getItem('gisc_saved_email');
      if (savedEmail) {
        setFormData(prev => ({ ...prev, email: savedEmail }));
        setRememberMe(true);
      }
    };
    loadSavedEmail();
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1E3A5F" />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Sign in to continue your study abroad journey
          </Text>
        </View>

        <View style={styles.form}>
          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={[styles.inputContainer, errors.email && styles.inputError]}>
              <Ionicons name="mail-outline" size={20} color="#5A7D9C" />
              <TextInput
                style={styles.input}
                placeholder="your.email@example.com"
                placeholderTextColor="#8AA0B8"
                value={formData.email}
                onChangeText={(text) => {
                  setFormData({ ...formData, email: text.toLowerCase() });
                  setErrors({ ...errors, email: null });
                }}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={[styles.inputContainer, errors.password && styles.inputError]}>
              <Ionicons name="lock-closed-outline" size={20} color="#5A7D9C" />
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#8AA0B8"
                value={formData.password}
                onChangeText={(text) => {
                  setFormData({ ...formData, password: text });
                  setErrors({ ...errors, password: null });
                }}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#5A7D9C"
                />
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
          </View>

          {/* Remember Me & Forgot Password */}
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={styles.rememberContainer}
              onPress={() => setRememberMe(!rememberMe)}
            >
              <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                {rememberMe && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
              </View>
              <Text style={styles.rememberText}>Remember me</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Demo Credentials (For Testing Only) */}
        <View style={styles.demoContainer}>
          <Text style={styles.demoTitle}>Demo Credentials</Text>
          <TouchableOpacity
            style={styles.demoButton}
            onPress={() => {
              setFormData({
                email: 'student@demo.com',
                password: 'demo123',
              });
            }}
          >
            <Text style={styles.demoButtonText}>Use Demo Account</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.footerLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  backButton: {
    marginTop: 50,
    marginBottom: 16,
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E3A5F',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#5A7D9C',
    lineHeight: 22,
  },
  form: {
    marginBottom: 24,
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#D0DDE9',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    backgroundColor: '#FAFCFE',
  },
  inputError: {
    borderColor: '#E74C3C',
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1E3A5F',
  },
  errorText: {
    fontSize: 12,
    color: '#E74C3C',
    marginTop: 6,
    marginLeft: 4,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#D0DDE9',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#1E3A5F',
    borderColor: '#1E3A5F',
  },
  rememberText: {
    fontSize: 14,
    color: '#5A7D9C',
  },
  forgotText: {
    fontSize: 14,
    color: '#1E3A5F',
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#1E3A5F',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1E3A5F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  demoContainer: {
    backgroundColor: '#F5F9FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#D0DDE9',
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E3A5F',
    marginBottom: 12,
    textAlign: 'center',
  },
  demoButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#1E3A5F',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  demoButtonText: {
    color: '#1E3A5F',
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#5A7D9C',
  },
  footerLink: {
    fontSize: 14,
    color: '#1E3A5F',
    fontWeight: '600',
  },
});

export default LoginScreen;
