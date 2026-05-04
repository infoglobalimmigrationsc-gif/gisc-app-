// frontend/src/screens/application/ApplicationLockScreen.jsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'https://api.gisc-liberia.com/api';

const ApplicationLockScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('mobile_money');

  useEffect(() => {
    checkApplicationAccess();
  }, []);

  const checkApplicationAccess = async () => {
    try {
      const token = await AsyncStorage.getItem('gisc_token');
      const response = await axios.get(`${API_URL}/application/check-access`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.data.hasAccess) {
        setHasAccess(true);
        navigation.replace('ApplicationForm');
      }
    } catch (error) {
      console.error('Error checking access:', error);
    } finally {
      setCheckingAccess(false);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('gisc_token');
      
      // Initiate payment
      const response = await axios.post(
        `${API_URL}/payment/initiate`,
        {
          amount: 10,
          type: 'application_fee',
          paymentMethod: selectedPaymentMethod,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        // Navigate to payment processing screen
        navigation.navigate('PaymentProcessing', {
          transactionId: response.data.transactionId,
          amount: 10,
          paymentMethod: selectedPaymentMethod,
        });
      }
    } catch (error) {
      Alert.alert('Payment Failed', 'Unable to initiate payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (checkingAccess) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E3A5F" />
        <Text style={styles.loadingText}>Checking access...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#1E3A5F" />
      </TouchableOpacity>

      {/* Lock Icon */}
      <View style={styles.lockIconContainer}>
        <View style={styles.lockIcon}>
          <Ionicons name="lock-closed" size={40} color="#FFFFFF" />
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>Unlock Full Application Access</Text>
      <Text style={styles.subtitle}>
        Pay a one-time fee of $10 to access the complete application form and receive our comprehensive study abroad brochure.
      </Text>

      {/* What's Included */}
      <View style={styles.featuresContainer}>
        <Text style={styles.featuresTitle}>What's Included:</Text>
        
        <View style={styles.featureItem}>
          <Ionicons name="checkmark-circle" size={20} color="#27AE60" />
          <Text style={styles.featureText}>Full application form access</Text>
        </View>
        
        <View style={styles.featureItem}>
          <Ionicons name="checkmark-circle" size={20} color="#27AE60" />
          <Text style={styles.featureText}>Digital study abroad brochure</Text>
        </View>
        
        <View style={styles.featureItem}>
          <Ionicons name="checkmark-circle" size={20} color="#27AE60" />
          <Text style={styles.featureText}>Priority counselor support</Text>
        </View>
        
        <View style={styles.featureItem}>
          <Ionicons name="checkmark-circle" size={20} color="#27AE60" />
          <Text style={styles.featureText}>Document upload capability</Text>
        </View>
        
        <View style={styles.featureItem}>
          <Ionicons name="checkmark-circle" size={20} color="#27AE60" />
          <Text style={styles.featureText}>Real-time application tracking</Text>
        </View>
      </View>

      {/* Price Display */}
      <View style={styles.priceContainer}>
        <Text style={styles.priceLabel}>One-Time Fee</Text>
        <Text style={styles.price}>$10.00</Text>
        <Text style={styles.priceNote}>Secure payment • Instant access</Text>
      </View>

      {/* Payment Methods */}
      <View style={styles.paymentMethodsContainer}>
        <Text style={styles.paymentMethodsTitle}>Select Payment Method</Text>
        
        <TouchableOpacity
          style={[
            styles.paymentMethod,
            selectedPaymentMethod === 'mobile_money' && styles.paymentMethodSelected,
          ]}
          onPress={() => setSelectedPaymentMethod('mobile_money')}
        >
          <View style={styles.paymentMethodLeft}>
            <Ionicons name="phone-portrait-outline" size={24} color="#1E3A5F" />
            <View style={styles.paymentMethodText}>
              <Text style={styles.paymentMethodName}>Mobile Money</Text>
              <Text style={styles.paymentMethodDesc}>Lonestar MTN • Orange Money</Text>
            </View>
          </View>
          {selectedPaymentMethod === 'mobile_money' && (
            <Ionicons name="checkmark-circle" size={24} color="#1E3A5F" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.paymentMethod,
            selectedPaymentMethod === 'card' && styles.paymentMethodSelected,
          ]}
          onPress={() => setSelectedPaymentMethod('card')}
        >
          <View style={styles.paymentMethodLeft}>
            <Ionicons name="card-outline" size={24} color="#1E3A5F" />
            <View style={styles.paymentMethodText}>
              <Text style={styles.paymentMethodName}>Credit / Debit Card</Text>
              <Text style={styles.paymentMethodDesc}>Visa • Mastercard • Verve</Text>
            </View>
          </View>
          {selectedPaymentMethod === 'card' && (
            <Ionicons name="checkmark-circle" size={24} color="#1E3A5F" />
          )}
        </TouchableOpacity>
      </View>

      {/* Trust Badges */}
      <View style={styles.trustContainer}>
        <View style={styles.trustItem}>
          <Ionicons name="shield-checkmark" size={16} color="#27AE60" />
          <Text style={styles.trustText}>Secure Payment</Text>
        </View>
        <View style={styles.trustItem}>
          <Ionicons name="refresh" size={16} color="#27AE60" />
          <Text style={styles.trustText}>Money-Back Guarantee</Text>
        </View>
        <View style={styles.trustItem}>
          <Ionicons name="headset" size={16} color="#27AE60" />
          <Text style={styles.trustText}>24/7 Support</Text>
        </View>
      </View>

      {/* Pay Button */}
      <TouchableOpacity
        style={[styles.payButton, loading && styles.payButtonDisabled]}
        onPress={handlePayment}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <>
            <Text style={styles.payButtonText}>Pay $10 to Continue</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </>
        )}
      </TouchableOpacity>

      {/* Terms */}
      <Text style={styles.termsText}>
        By proceeding, you agree to our{' '}
        <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
        <Text style={styles.termsLink}>Refund Policy</Text>
      </Text>

      {/* Support Link */}
      <TouchableOpacity 
        style={styles.supportLink}
        onPress={() => navigation.navigate('Chat')}
      >
        <Ionicons name="chatbubble-outline" size={16} color="#5A7D9C" />
        <Text style={styles.supportText}>Need help? Talk to an advisor</Text>
      </TouchableOpacity>
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
  backButton: {
    marginBottom: 20,
  },
  lockIconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  lockIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1E3A5F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1E3A5F',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: '#5A7D9C',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  featuresContainer: {
    backgroundColor: '#F5F9FF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E8EEF5',
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E3A5F',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#1E3A5F',
    marginLeft: 12,
  },
  priceContainer: {
    alignItems: 'center',
    marginBottom: 28,
  },
  priceLabel: {
    fontSize: 14,
    color: '#5A7D9C',
    marginBottom: 4,
  },
  price: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1E3A5F',
  },
  priceNote: {
    fontSize: 12,
    color: '#8AA0B8',
    marginTop: 4,
  },
  paymentMethodsContainer: {
    marginBottom: 20,
  },
  paymentMethodsTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E3A5F',
    marginBottom: 12,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: '#D0DDE9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#FAFCFE',
  },
  paymentMethodSelected: {
    borderColor: '#1E3A5F',
    backgroundColor: '#F5F9FF',
  },
  paymentMethodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodText: {
    marginLeft: 14,
  },
  paymentMethodName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1E3A5F',
  },
  paymentMethodDesc: {
    fontSize: 12,
    color: '#8AA0B8',
    marginTop: 2,
  },
  trustContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trustText: {
    fontSize: 12,
    color: '#5A7D9C',
    marginLeft: 6,
  },
  payButton: {
    backgroundColor: '#1E3A5F',
    borderRadius: 12,
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#1E3A5F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  payButtonDisabled: {
    opacity: 0.7,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  termsText: {
    fontSize: 12,
    color: '#8AA0B8',
    textAlign: 'center',
    marginBottom: 16,
  },
  termsLink: {
    color: '#1E3A5F',
    fontWeight: '500',
  },
  supportLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  supportText: {
    fontSize: 14,
    color: '#5A7D9C',
    marginLeft: 6,
  },
});

export default ApplicationLockScreen;
