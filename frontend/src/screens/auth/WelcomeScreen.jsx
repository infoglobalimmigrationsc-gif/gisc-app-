// frontend/src/screens/auth/WelcomeScreen.jsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';

const { width } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <View style={styles.logoBadge}>
          <View style={styles.logoSquare}>
            <Text style={styles.logoText}>GISC</Text>
          </View>
          <Text style={styles.brandName}>Global Immigration SC</Text>
        </View>

        <Text style={styles.heroTitle}>
          Your Gateway to{'\n'}Global Education
        </Text>
        <Text style={styles.heroSubtitle}>
          Trusted by students across Africa to secure admissions, scholarships, and visas at top universities worldwide.
        </Text>

        {/* Stats Row */}
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
            <Text style={styles.statLabel}>Partner Universities</Text>
          </View>
        </View>
      </View>

      {/* Feature Cards */}
      <View style={styles.featuresRow}>
        <View style={styles.featureCard}>
          <View style={[styles.featureIcon, { backgroundColor: '#EBF3FA' }]}>
            <Text style={styles.featureIconText}>🎓</Text>
          </View>
          <Text style={styles.featureTitle}>University Admissions</Text>
          <Text style={styles.featureDesc}>Guaranteed placement at top institutions</Text>
        </View>
        <View style={styles.featureCard}>
          <View style={[styles.featureIcon, { backgroundColor: '#E8F8E8' }]}>
            <Text style={styles.featureIconText}>💰</Text>
          </View>
          <Text style={styles.featureTitle}>Scholarships</Text>
          <Text style={styles.featureDesc}>Up to 75% tuition coverage</Text>
        </View>
      </View>

      {/* Bottom CTA */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation.navigate('Signup')}
          activeOpacity={0.9}
        >
          <Text style={styles.ctaButtonText}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.loginLink}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginLinkText}>I already have an account</Text>
        </TouchableOpacity>

        <Text style={styles.termsText}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  heroSection: {
    backgroundColor: '#1a3a5c',
    paddingHorizontal: 28,
    paddingTop: 60,
    paddingBottom: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  logoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  logoSquare: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#cc2936',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 1,
  },
  brandName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
    lineHeight: 42,
  },
  heroSubtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 22,
    marginBottom: 32,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  featuresRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: -20,
    marginBottom: 24,
  },
  featureCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  featureIconText: {
    fontSize: 22,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a3a5c',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 12,
    color: '#888888',
    lineHeight: 17,
  },
  bottomSection: {
    paddingHorizontal: 28,
    paddingBottom: 40,
  },
  ctaButton: {
    backgroundColor: '#cc2936',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#cc2936',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  ctaButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  loginLink: {
    alignItems: 'center',
    marginBottom: 24,
  },
  loginLinkText: {
    fontSize: 15,
    color: '#1a3a5c',
    fontWeight: '500',
  },
  termsText: {
    fontSize: 12,
    color: '#aaaaaa',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default WelcomeScreen;
