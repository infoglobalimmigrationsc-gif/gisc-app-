// frontend/src/navigation/AppNavigator.jsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';

// Auth Screens
import SplashScreen from '../screens/SplashScreen';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import ProfileSetupScreen from '../screens/auth/ProfileSetupScreen';

// Main Screens
import HomeScreen from '../screens/dashboard/HomeScreen';
import ApplicationsScreen from '../screens/application/ApplicationsScreen';
import ApplicationTrackerScreen from '../screens/application/ApplicationTrackerScreen';
import ApplicationFormScreen from '../screens/application/ApplicationFormScreen';
import ApplicationLockScreen from '../screens/application/ApplicationLockScreen';
import DocumentUploadScreen from '../screens/application/DocumentUploadScreen';
import ChatScreen from '../screens/chat/ChatScreen';
import MeetingsScreen from '../screens/chat/MeetingsScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import PaymentProcessingScreen from '../screens/payment/PaymentProcessingScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Bar Icon Component
const TabIcon = ({ label, focused }) => {
  const icons = {
    Explore: focused ? '🔍' : '🔍',
    Chat: focused ? '💬' : '💬',
    Meet: focused ? '📅' : '📅',
    Applications: focused ? '📋' : '📋',
    Profile: focused ? '👤' : '👤',
  };

  return (
    <View style={styles.tabIcon}>
      <Text style={styles.tabEmoji}>{icons[label]}</Text>
      <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>
        {label}
      </Text>
    </View>
  );
};

// Main Tab Navigator
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused }) => (
        <TabIcon label={route.name} focused={focused} />
      ),
      tabBarStyle: {
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        paddingTop: 8,
        paddingBottom: 28,
        height: 80,
      },
      tabBarShowLabel: false,
    })}
  >
    <Tab.Screen name="Explore" component={HomeScreen} />
    <Tab.Screen name="Chat" component={ChatScreen} />
    <Tab.Screen name="Meet" component={MeetingsScreen} />
    <Tab.Screen name="Applications" component={ApplicationsScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="ApplicationTracker" component={ApplicationTrackerScreen} />
        <Stack.Screen name="ApplicationForm" component={ApplicationFormScreen} />
        <Stack.Screen name="ApplicationLock" component={ApplicationLockScreen} />
        <Stack.Screen name="DocumentUpload" component={DocumentUploadScreen} />
        <Stack.Screen name="PaymentProcessing" component={PaymentProcessingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabEmoji: {
    fontSize: 20,
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 10,
    color: '#888888',
  },
  tabLabelFocused: {
    color: '#cc2936',
    fontWeight: '600',
  },
});

export default AppNavigator;
