// frontend/src/screens/payment/PaymentProcessingScreen.jsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'https://api.gisc-liberia.com/api';

const PaymentProcessingScreen = ({ navigation, route }) => {
  const { transactionId, amount, paymentMethod } = route.params;
  const [step, setStep] = useState('input'); // input, processing, success, failed
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleMobileMoneyPayment = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      Alert.alert('Invalid Number', 'Please enter a valid mobile money number');
      return;
    }

    setLoading(true);
    setStep('processing');

    try {
      const token = await AsyncStorage.getItem('gisc_token');
      
      // Simulate payment processing
      const response = await axios.post(
        `${API_URL}/payment/process-mobile`,
        {
          transactionId,
          phoneNumber,
          amount,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Start countdown for payment completion
      setCountdown(30);
      
      // Check payment status
      const checkInterval = setInterval(async () => {
        try {
          const statusResponse = await axios.get(
            `${API_URL}/payment/status/${transactionId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (statusResponse.data.status === 'completed') {
            clearInterval(checkInterval);
            setStep('success');
            
            // Unlock application access
            await AsyncStorage.setItem('gisc_app_unlocked', 'true');
            
            setTimeout(() => {
              navigation.replace('ApplicationForm');
            }, 2000);
          } else if (statusResponse.data.status === 'failed') {
            clearInterval(checkInterval);
            setStep('failed');
          }
        } catch (error) {
          console.error('Status check error:', error);
        }
      }, 3000);

      // Cleanup interval after 2 minutes
      setTimeout(() => clearInterval(checkInterval), 120000);
      
    } catch (error) {
      setStep('failed');
      Alert.alert('Payment Failed', error.response?.data?.message || 'Unable to process payment');
    } finally {
      setLoading(false);
    }
  };

  const handleCardPayment = () => {
    // Navigate to card payment webview or use Flutterwave inline
    navigation.navigate('CardPayment', { transactionId, amount });
  };

  const renderInputStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.amountCard}>
        <Text style={styles.amountLabel}>Amount to Pay</Text>
        <Text style={styles.amountValue}>${amount.toFixed(2)}</Text>
      </View>

      {paymentMethod === 'mobile_money' ? (
        <>
          <Text style={styles.inputLabel}>Enter Mobile Money Number</Text>
          <View style={styles.phoneInputContainer}>
            <View style={styles.countryCode}>
              <Text style={styles.countryCodeText}>+231</Text>
            </View>
            <TextInput
              style={styles.phoneInput}
              placeholder="XX XXX XXX"
              placeholderTextColor="#8AA0B8"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              maxLength={9}
            />
          </View>
          <Text style={styles.hintText}>
            You will receive a push notification on your phone to authorize payment
          </Text>
          <TouchableOpacity
            style={styles.payButton}
            onPress={handleMobileMoneyPayment}
          >
            <Text style={styles.payButtonText}>Pay with Mobile Money</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.inputLabel}>Pay with Card</Text>
          <Text style={styles.hintText}>
            You will be redirected to our secure payment gateway
          </Text>
          <TouchableOpacity
            style={styles.payButton}
            onPress={handleCardPayment}
          >
            <Text style={styles.payButtonText}>Continue to Payment</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );

  const renderProcessingStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.processingIcon}>
        <ActivityIndicator size="large" color="#1E3A5F" />
      </View>
      <Text style={styles.processingTitle}>Processing Payment</Text>
      <Text style={styles.processingText}>
        Please check your phone and enter your PIN to authorize the payment
      </Text>
      {countdown > 0 && (
        <Text style={styles.countdownText}>
          Waiting for authorization... {countdown}s
        </Text>
      )}
      <View style={styles.processingSteps}>
        <View style={styles.processingStep}>
          <Ionicons name="checkmark-circle" size={20} color="#27AE60" />
          <Text style={styles.processingStepText}>Payment initiated</Text>
        </View>
        <View style={styles.processingStep}>
          <ActivityIndicator size="small" color="#1E3A5F" />
          <Text style={styles.processingStepText}>Awaiting confirmation</Text>
        </View>
        <View style={styles.processingStep}>
          <Ionicons name="time-outline" size={20} color="#8AA0B8" />
          <Text style={styles.processingStepTextPending}>Unlocking access</Text>
        </View>
      </View>
    </View>
  );

  const renderSuccessStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.successIcon}>
        <Ionicons name="checkmark-circle" size={70} color="#27AE60" />
      </View>
      <Text style={styles.successTitle}>Payment Successful!</Text>
      <Text style={styles.successText}>
        Your application has been unlocked. Redirecting you to the application form...
      </Text>
      <View style={styles.successDetails}>
        <Text style={styles.successDetailLabel}>Transaction ID</Text>
        <Text style={styles.successDetailValue}>{transactionId}</Text>
        <Text style={styles.successDetailLabel}>Amount Paid</Text>
        <Text style={styles.successDetailValue}>${amount.toFixed(2)}</Text>
      </View>
    </View>
  );

  const renderFailedStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.failedIcon}>
        <Ionicons name="close-circle" size={70} color="#E74C3C" />
      </View>
      <Text style={styles.failedTitle}>Payment Failed</Text>
      <Text style={styles.failedText}>
        We couldn't process your payment. Please try again or use a different payment method.
      </Text>
      <TouchableOpacity
        style={styles.retryButton}
        onPress={() => setStep('input')}
      >
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.supportButton}
        onPress={() => navigation.navigate('Chat')}
      >
        <Text style={styles.supportButtonText}>Contact Support</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => step === 'input' ? navigation.goBack() : null}
      >
        <Ionicons name="arrow-back" size={24} color="#1E3A5F" />
      </TouchableOpacity>

      <View style={styles.content}>
        {step === 'input' && renderInputStep()}
        {step === 'processing' && renderProcessingStep()}
        {step === 'success' && renderSuccessStep()}
        {step === 'failed' && renderFailedStep()}
      </View>

      {/* Secure Payment Badge */}
      <View style={styles.secureBadge}>
        <Ionicons name="lock-closed" size={14} color="#27AE60" />
        <Text style={styles.secureText}>Secured by Flutterwave</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    marginTop: 60,
    marginLeft: 24,
    marginBottom: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  stepContainer: {
    flex: 1,
  },
  amountCard: {
    backgroundColor: '#1E3A5F',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 32,
  },
  amountLabel: {
    fontSize: 14,
    color: '#A8D0E6',
    marginBottom: 8,
  },
  amountValue: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1E3A5F',
    marginBottom: 12,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  countryCode: {
    backgroundColor: '#F5F9FF',
    borderWidth: 1.5,
    borderColor: '#D0DDE9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginRight: 8,
  },
  countryCodeText: {
    fontSize: 16,
    color: '#1E3A5F',
    fontWeight: '500',
  },
  phoneInput: {
    flex: 1,
    backgroundColor: '#FAFCFE',
    borderWidth: 1.5,
    borderColor: '#D0DDE9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1E3A5F',
  },
  hintText: {
    fontSize: 13,
    color: '#8AA0B8',
    marginBottom: 28,
    lineHeight: 18,
  },
  payButton: {
    backgroundColor: '#1E3A5F',
    borderRadius: 12,
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  cancelButton: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#8AA0B8',
  },
  processingIcon: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 24,
  },
  processingTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E3A5F',
    textAlign: 'center',
    marginBottom: 12,
  },
  processingText: {
    fontSize: 15,
    color: '#5A7D9C',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  countdownText: {
    fontSize: 14,
    color: '#F39C12',
    textAlign: 'center',
    marginBottom: 32,
  },
  processingSteps: {
    backgroundColor: '#F5F9FF',
    borderRadius: 12,
    padding: 20,
  },
  processingStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  processingStepText: {
    fontSize: 15,
    color: '#1E3A5F',
    marginLeft: 12,
  },
  processingStepTextPending: {
    fontSize: 15,
    color: '#8AA0B8',
    marginLeft: 12,
  },
  successIcon: {
    alignItems: 'center',
    marginTop: 80,
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#27AE60',
    textAlign: 'center',
    marginBottom: 12,
  },
  successText: {
    fontSize: 15,
    color: '#5A7D9C',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  successDetails: {
    backgroundColor: '#F5F9FF',
    borderRadius: 12,
    padding: 20,
  },
  successDetailLabel: {
    fontSize: 13,
    color: '#8AA0B8',
    marginBottom: 4,
  },
  successDetailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E3A5F',
    marginBottom: 16,
  },
  failedIcon: {
    alignItems: 'center',
    marginTop: 80,
    marginBottom: 24,
  },
  failedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E74C3C',
    textAlign: 'center',
    marginBottom: 12,
  },
  failedText: {
    fontSize: 15,
    color: '#5A7D9C',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  retryButton: {
    backgroundColor: '#1E3A5F',
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  supportButton: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  supportButtonText: {
    fontSize: 14,
    color: '#5A7D9C',
  },
  secureBadge: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E8EEF5',
  },
  secureText: {
    fontSize: 12,
    color: '#8AA0B8',
    marginLeft: 6,
  },
});

export default PaymentProcessingScreen;
