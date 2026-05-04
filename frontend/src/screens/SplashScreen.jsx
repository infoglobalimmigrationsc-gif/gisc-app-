// frontend/src/screens/SplashScreen.jsx
import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('gisc_token');
      const profileComplete = await AsyncStorage.getItem('gisc_profile_complete');
      
      setTimeout(() => {
        if (token) {
          if (profileComplete === 'true') {
            navigation.replace('Home');
          } else {
            navigation.replace('ProfileSetup');
          }
        } else {
          navigation.replace('Welcome');
        }
      }, 2000);
    };
    
    checkAuth();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>GISC</Text>
        <Text style={styles.tagline}>Global Immigration SC</Text>
      </View>
      <Text style={styles.footerText}>Your Gateway to Global Education</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E3A5F',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 60,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 4,
  },
  tagline: {
    fontSize: 16,
    color: '#A8D0E6',
    marginTop: 8,
  },
  footerText: {
    fontSize: 14,
    color: '#A8D0E6',
  },
});

export default SplashScreen;
