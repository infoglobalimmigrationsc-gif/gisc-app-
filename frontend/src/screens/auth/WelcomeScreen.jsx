// frontend/src/screens/auth/WelcomeScreen.jsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Hero Image Background */}
      <View style={styles.heroSection}>
        <View style={styles.heroOverlay}>
          <View style={styles.logoRow}>
            <View style={styles.logoSquare}>
              <Text style={styles.logoText}>GISC</Text>
            </View>
            <Text style={styles.brandName}>Global Immigration SC</Text>
          </View>
          
          <Text style={styles.heroTitle}>Your Gateway to{'\n'}Global Education</Text>
          <Text style={styles.heroSubtitle}>
            Secure admissions, scholarships, and visas at top universities worldwide
          </Text>

          {/* Stats Strip */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>500+</Text>
              <Text style={styles.statLabel}>Students Placed</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>97%</Text>
              <Text style={styles.statLabel}>Visa Success</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>50+</Text>
              <Text style={styles.statLabel}>Universities</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Sky Blue Curved Container */}
      <View style={styles.bottomContainer}>
        <View style={styles.curve} />
        
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={() => navigation.navigate('Signup')}
          activeOpacity={0.9}
        >
          <Text style={styles.getStartedText}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.googleButton}
          onPress={() => navigation.navigate('Signup')}
        >
          <Text style={styles.googleIcon}>G</Text>
          <Text style={styles.googleText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.loginLink}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginText}>I already have an account</Text>
        </TouchableOpacity>

        <Text style={styles.termsText}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#cc2936' },
  heroSection: { flex: 1, justifyContent: 'flex-end' },
  heroOverlay: { paddingHorizontal: 28, paddingBottom: 20 },
  logoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 32 },
  logoSquare: { width: 48, height: 48, borderRadius: 14, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  logoText: { fontSize: 18, fontWeight: 'bold', color: '#cc2936', letterSpacing: 1 },
  brandName: { fontSize: 16, fontWeight: '600', color: '#ffffff' },
  heroTitle: { fontSize: 36, fontWeight: 'bold', color: '#ffffff', marginBottom: 12, lineHeight: 44 },
  heroSubtitle: { fontSize: 15, color: 'rgba(255,255,255,0.8)', lineHeight: 22, marginBottom: 28 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: 18 },
  statItem: { alignItems: 'center', flex: 1 },
  statNumber: { fontSize: 22, fontWeight: 'bold', color: '#ffffff', marginBottom: 4 },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.75)', textAlign: 'center' },
  statDivider: { width: 1, height: 36, backgroundColor: 'rgba(255,255,255,0.2)' },
  bottomContainer: { backgroundColor: '#3b82f6', paddingHorizontal: 28, paddingTop: 24, paddingBottom: 40, borderTopLeftRadius: 32, borderTopRightRadius: 32 },
  curve: { position: 'absolute', top: -20, left: 0, right: 0, height: 40, backgroundColor: '#3b82f6', borderTopLeftRadius: 32, borderTopRightRadius: 32 },
  getStartedButton: { backgroundColor: '#ffffff', borderRadius: 14, paddingVertical: 18, alignItems: 'center', marginBottom: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 4 },
  getStartedText: { color: '#cc2936', fontSize: 17, fontWeight: '700' },
  googleButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#3b82f6', borderRadius: 14, paddingVertical: 16, marginBottom: 20, borderWidth: 1.5, borderColor: '#ffffff' },
  googleIcon: { fontSize: 20, fontWeight: 'bold', color: '#ffffff', marginRight: 12, backgroundColor: 'rgba(255,255,255,0.2)', width: 32, height: 32, borderRadius: 16, textAlign: 'center', lineHeight: 32 },
  googleText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  loginLink: { alignItems: 'center', marginBottom: 24 },
  loginText: { color: '#ffffff', fontSize: 15, fontWeight: '500' },
  termsText: { fontSize: 11, color: 'rgba(255,255,255,0.7)', textAlign: 'center', lineHeight: 16 },
});

export default WelcomeScreen;
