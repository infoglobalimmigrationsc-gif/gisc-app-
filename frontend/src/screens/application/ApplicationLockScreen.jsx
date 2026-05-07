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
import Icon from '../../components/Icon';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';

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
      const response = await api.get('/application/check-access');
      
      if (response.data?.hasAccess) {
        setHasAccess(true);
        navigation.replace('ApplicationForm');
      }
    } catch (error) {
      // No access yet - user needs to pay
      console.log('Application not yet unlocked');
    } finally {
      setCheckingAccess(false);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await api.post('/payment/initiate', {
        amount: 10,
        type: 'application_fee',
        paymentMethod: selectedPaymentMethod,
      });
      
      if (response.data?.success) {
        navigation.navigate('PaymentProcessing', {
          transactionId: response.data.transactionId,
          amount: 10,
          paymentMethod: selectedPaymentMethod,
        });
      } else {
        Alert.alert('Error', 'Unable to initiate payment. Please try again.');
      }
    } catch (error) {
      Alert.alert('Payment Failed', 'Cannot connect to payment server. Check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (checkingAccess) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1a3a5c" />
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
        <Text style={styles.backArrow}>←</Text>
      </TouchableOpacity>

      {/* Lock Icon */}
      <View style={styles.lockIconContainer}>
        <View style={styles.lockIcon}>
          <Text style={styles.lockEmoji}>🔒</Text>
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
          <Text style={styles.featureCheck}>✓</Text>
          <Text style={styles.featureText}>Full application form access</Text>
        </View>
        
        <View style={styles.featureItem}>
          <Text style={styles.featureCheck}>✓</Text>
          <Text style={styles.featureText}>Digital study abroad brochure</Text>
        </View>
        
        <View style={styles.featureItem}>
          <Text style={styles.featureCheck}>✓</Text>
          <Text style={styles.featureText}>Priority counselor support</Text>
        </View>
        
        <View style={styles.featureItem}>
          <Text style={styles.featureCheck}>✓</Text>
          <Text style={styles.featureText}>Document upload capability</Text>
        </View>
        
        <View style={styles.featureItem}>
          <Text style={styles.featureCheck}>✓</Text>
          <Text style={styles.featureText}>Real-time application tracking</Text>
        </View>
      </View>

      {/* Price Display */}
      <View style={styles.priceContainer}>
        <Text style={styles.priceLabel}>One-Time Fee</Text>
        <Text style={styles.price}>$10.00</Text>
        <Text style={styles.priceNote}>Secure payment · Instant access</Text>
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
            <Text style={styles.paymentIcon}>📱</Text>
            <View style={styles.paymentMethodText}>
              <Text style={styles.paymentMethodName}>Mobile Money</Text>
              <Text style={styles.paymentMethodDesc}>Lonestar MTN · Orange Money</Text>
            </View>
          </View>
          {selectedPaymentMethod === 'mobile_money' && (
            <Text style={styles.selectedCheck}>✓</Text>
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
            <Text style={styles.paymentIcon}>💳</Text>
            <View style={styles.paymentMethodText}>
              <Text style={styles.paymentMethodName}>Credit / Debit Card</Text>
              <Text style={styles.paymentMethodDesc}>Visa · Mastercard · Verve</Text>
            </View>
          </View>
          {selectedPaymentMethod === 'card' && (
            <Text style={styles.selectedCheck}>✓</Text>
          )}
        </TouchableOpacity>
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
          <Text style={styles.payButtonText}>Pay $10 to Continue</Text>
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
        <Text style={styles.supportIcon}>💬</Text>
        <Text style={styles.supportText}>Need help? Talk to an advisor</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  content: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' },
  loadingText: { marginTop: 12, fontSize: 14, color: '#888888' },
  backButton: { marginBottom: 20 },
  backArrow: { fontSize: 24, color: '#1a3a5c' },
  lockIconContainer: { alignItems: 'center', marginBottom: 24 },
  lockIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#1a3a5c', justifyContent: 'center', alignItems: 'center' },
  lockEmoji: { fontSize: 36 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#1a3a5c', textAlign: 'center', marginBottom: 12 },
  subtitle: { fontSize: 15, color: '#888888', textAlign: 'center', lineHeight: 22, marginBottom: 28 },
  featuresContainer: { backgroundColor: '#f8fafc', borderRadius: 16, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: '#e8eef5' },
  featuresTitle: { fontSize: 16, fontWeight: '600', color: '#1a3a5c', marginBottom: 16 },
  featureItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  featureCheck: { fontSize: 16, color: '#27AE60', fontWeight: 'bold', marginRight: 12, width: 20 },
  featureText: { fontSize: 14, color: '#1a3a5c' },
  priceContainer: { alignItems: 'center', marginBottom: 28 },
  priceLabel: { fontSize: 14, color: '#888888', marginBottom: 4 },
  price: { fontSize: 48, fontWeight: 'bold', color: '#1a3a5c' },
  priceNote: { fontSize: 12, color: '#aaaaaa', marginTop: 4 },
  paymentMethodsContainer: { marginBottom: 20 },
  paymentMethodsTitle: { fontSize: 15, fontWeight: '600', color: '#1a3a5c', marginBottom: 12 },
  paymentMethod: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1.5, borderColor: '#e0e0e0', borderRadius: 12, padding: 16,
    marginBottom: 12, backgroundColor: '#fafcfe',
  },
  paymentMethodSelected: { borderColor: '#1a3a5c', backgroundColor: '#f5f9ff' },
  paymentMethodLeft: { flexDirection: 'row', alignItems: 'center' },
  paymentIcon: { fontSize: 24, marginRight: 14 },
  paymentMethodText: {},
  paymentMethodName: { fontSize: 15, fontWeight: '500', color: '#1a3a5c' },
  paymentMethodDesc: { fontSize: 12, color: '#aaaaaa', marginTop: 2 },
  selectedCheck: { fontSize: 20, color: '#1a3a5c', fontWeight: 'bold' },
  payButton: {
    backgroundColor: '#cc2936', borderRadius: 12, height: 56,
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
    shadowColor: '#cc2936', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  payButtonDisabled: { opacity: 0.7 },
  payButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  termsText: { fontSize: 12, color: '#aaaaaa', textAlign: 'center', marginBottom: 16 },
  termsLink: { color: '#1a3a5c', fontWeight: '500' },
  supportLink: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  supportIcon: { fontSize: 16, marginRight: 6 },
  supportText: { fontSize: 14, color: '#888888' },
});

export default ApplicationLockScreen;
