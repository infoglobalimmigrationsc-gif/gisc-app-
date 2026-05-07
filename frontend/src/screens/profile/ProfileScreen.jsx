// frontend/src/screens/profile/ProfileScreen.jsx
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/profile');
        if (res.data?.success) setUser(res.data.user);
      } catch (error) {}
    };
    load();
  }, []);

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: async () => {
        await AsyncStorage.clear();
        navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
      }},
    ]);
  };

  if (!user) return <View style={styles.container}><Text style={styles.loading}>Loading...</Text></View>;

  return (
    <View style={styles.container}>
      {/* Red Header Block */}
      <View style={styles.profileHeader}>
        <View style={styles.headerRow}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarLargeText}>{user.fullName?.charAt(0)?.toUpperCase() || 'S'}</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.userName}>{user.fullName}</Text>
            <Text style={styles.userId}>ID: {user._id?.slice(-8).toUpperCase() || 'GISCUSER'}</Text>
            <Text style={styles.userLocation}>{user.country || 'Liberia'}</Text>
          </View>
        </View>
      </View>

      {/* Alert Banner */}
      <View style={styles.alertBanner}>
        <Text style={styles.alertText}>Complete your profile to get better recommendations</Text>
        <TouchableOpacity style={styles.verifyButton}>
          <Text style={styles.verifyButtonText}>Complete</Text>
        </TouchableOpacity>
      </View>

      {/* Navigation List */}
      <ScrollView style={styles.menuList}>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('DocumentUpload')}>
          <View style={[styles.menuIcon, { backgroundColor: '#EBF3FA' }]}>
            <Text style={styles.menuIconText}>📄</Text>
          </View>
          <Text style={styles.menuLabel}>Documents</Text>
          <View style={styles.menuRight}>
            <Text style={[styles.menuStatus, { color: '#3b82f6' }]}>Upload</Text>
            <Text style={styles.menuArrow}>›</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={[styles.menuIcon, { backgroundColor: '#E8F8E8' }]}>
            <Text style={styles.menuIconText}>🎓</Text>
          </View>
          <Text style={styles.menuLabel}>Education History</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ApplicationTracker')}>
          <View style={[styles.menuIcon, { backgroundColor: '#FFF3E0' }]}>
            <Text style={styles.menuIconText}>📋</Text>
          </View>
          <Text style={styles.menuLabel}>Application Tracker</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={[styles.menuIcon, { backgroundColor: '#F3E5F5' }]}>
            <Text style={styles.menuIconText}>💰</Text>
          </View>
          <Text style={styles.menuLabel}>Refer a Friend</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={[styles.menuIcon, { backgroundColor: '#f5f5f5' }]}>
            <Text style={styles.menuIconText}>⚙️</Text>
          </View>
          <Text style={styles.menuLabel}>Settings</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <View style={[styles.menuIcon, { backgroundColor: '#f5f5f5' }]}>
            <Text style={styles.menuIconText}>📝</Text>
          </View>
          <Text style={styles.menuLabel}>Terms of Service</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
      <Text style={styles.version}>Version 1.0.0</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  loading: { textAlign: 'center', marginTop: 100, fontSize: 16, color: '#888' },
  profileHeader: { backgroundColor: '#cc2936', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 28, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  avatarLarge: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  avatarLargeText: { fontSize: 26, fontWeight: 'bold', color: '#cc2936' },
  headerInfo: { flex: 1 },
  userName: { fontSize: 22, fontWeight: 'bold', color: '#ffffff', marginBottom: 2 },
  userId: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 4 },
  userLocation: { fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  alertBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF5F5', borderRadius: 12, padding: 14, marginHorizontal: 20, marginTop: -14, marginBottom: 8, borderWidth: 1, borderColor: '#FFD5D5' },
  alertText: { flex: 1, fontSize: 12, color: '#cc2936', marginRight: 10 },
  verifyButton: { backgroundColor: '#3b82f6', borderRadius: 6, paddingVertical: 6, paddingHorizontal: 14 },
  verifyButtonText: { color: '#ffffff', fontSize: 12, fontWeight: '600' },
  menuList: { flex: 1, paddingTop: 8 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  menuIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  menuIconText: { fontSize: 18 },
  menuLabel: { flex: 1, fontSize: 15, color: '#1a1a2e', fontWeight: '500' },
  menuRight: { flexDirection: 'row', alignItems: 'center' },
  menuStatus: { fontSize: 12, fontWeight: '500', marginRight: 8 },
  menuArrow: { fontSize: 22, color: '#cccccc' },
  logoutButton: { marginHorizontal: 20, marginTop: 10, paddingVertical: 14, alignItems: 'center' },
  logoutText: { fontSize: 15, color: '#cc2936', fontWeight: '500' },
  version: { textAlign: 'center', fontSize: 11, color: '#aaaaaa', paddingBottom: 30 },
});

export default ProfileScreen;
