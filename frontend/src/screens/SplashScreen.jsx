// frontend/src/screens/SplashScreen.jsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = ({ navigation }) => {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('gisc_token');
      const profileComplete = await AsyncStorage.getItem('gisc_profile_complete');
      
      setTimeout(() => {
        if (token) {
          if (profileComplete === 'true') {
            navigation.replace('Main');
          } else {
            navigation.replace('ProfileSetup');
          }
        } else {
          navigation.replace('Welcome');
        }
      }, 2500);
    };
    
    checkAuth();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
        ]}
      >
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <Text style={styles.logoText}>GISC</Text>
          </View>
          <Text style={styles.tagline}>Global Immigration SC</Text>
        </View>
        
        <View style={styles.statsContainer}>
          <Text style={styles.statsNumber}>500+</Text>
          <Text style={styles.statsLabel}>Students Placed Across the Globe</Text>
        </View>
      </Animated.View>
      
      <Text style={styles.footer}>Your Gateway to Global Education</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a3a5c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoIcon: {
    width: 100,
    height: 100,
    borderRadius: 24,
    backgroundColor: '#cc2936',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 16,
    color: '#c0c0c0',
    letterSpacing: 1,
  },
  statsContainer: {
    alignItems: 'center',
  },
  statsNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  statsLabel: {
    fontSize: 16,
    color: '#c0c0c0',
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    fontSize: 14,
    color: '#c0c0c0',
  },
});

export default SplashScreen;
