// frontend/src/screens/auth/WelcomeScreen.jsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Top Section */}
      <View style={styles.topSection}>
        <View style={styles.logoIcon}>
          <Text style={styles.logoText}>GISC</Text>
        </View>
      </View>

      {/* Middle Section */}
      <View style={styles.middleSection}>
        <Text style={styles.mainTitle}>500+</Text>
        <Text style={styles.subtitle}>
          Trusted by 500+ students across Africa and beyond
        </Text>
        
        <View style={styles.trustBadges}>
          <View style={styles.badge}>
            <Text style={styles.badgeNumber}>97%</Text>
            <Text style={styles.badgeLabel}>Visa Success</Text>
          </View>
          <View style={styles.badgeDivider} />
          <View style={styles.badge}>
            <Text style={styles.badgeNumber}>50+</Text>
            <Text style={styles.badgeLabel}>Universities</Text>
          </View>
          <View style={styles.badgeDivider} />
          <View style={styles.badge}>
            <Text style={styles.badgeNumber}>15+</Text>
            <Text style={styles.badgeLabel}>Countries</Text>
          </View>
        </View>
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={() => navigation.navigate('Signup')}
          activeOpacity={0.9}
        >
          <Text style={styles.getStartedText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a3a5c',
  },
  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#cc2936',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  logoText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 2,
  },
  middleSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  mainTitle: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#c0c0c0',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 40,
  },
  trustBadges: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  badgeNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#cc2936',
    marginBottom: 4,
  },
  badgeLabel: {
    fontSize: 12,
    color: '#c0c0c0',
    textAlign: 'center',
  },
  badgeDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  bottomSection: {
    paddingHorizontal: 30,
    paddingBottom: 50,
  },
  getStartedButton: {
    backgroundColor: '#cc2936',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#cc2936',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  getStartedText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});

export default WelcomeScreen;
