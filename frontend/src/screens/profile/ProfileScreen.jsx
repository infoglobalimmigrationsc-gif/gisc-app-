// frontend/src/screens/profile/ProfileScreen.jsx
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);

  useEffect(() => { loadUserProfile(); }, []);

  const loadUserProfile = async () => {
    try {
      const response = await api.get('/profile');
      if (response.data.success) setUser(response.data.user);
    } catch (error) {}
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: async () => {
        await AsyncStorage.clear();
        navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
      }},
    ]);
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.profileTop}>
          <View style={styles.profileAvatar}>
            <Text style={styles.avatarText}>{user.fullName?.charAt(0)?.toUpperCase() || 'S'}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{user.fullName}</Text>
            <Text style={styles.userLocation}>Liberia</Text>
            {user.profile?.preferredCountry && (
              <View style={styles.goalBadge}>
                <Text style={styles.goalText}>
                  {user.profile.studyLevel || 'Undergraduate'} in {user.profile.courseOfStudy || 'Business'} — {user.profile.preferredCountry}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Counselor Card */}
        <View style={styles.counselorCard}>
          <View style={styles.counselorLeft}>
            <View style={styles.counselorAvatar}>
              <Text style={styles.counselorAvatarText}>F</Text>
            </View>
            <View>
              <Text style={styles.counselorName}>Faith Isikwei</Text>
              <Text style={styles.counselorRole}>Senior Counsellor</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.bookSessionBtn} onPress={() => navigation.navigate('Meet')}>
            <Text style={styles.bookSessionText}>Book Session</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Menu */}
      <ScrollView style={styles.menuSection}>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('DocumentUpload')}>
          <Text style={styles.menuIcon}>📄</Text>
          <Text style={styles.menuText}>Documents</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>⭐</Text>
          <Text style={styles.menuText}>Shortlist</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ApplicationTracker')}>
          <Text style={styles.menuIcon}>📋</Text>
          <Text style={styles.menuText}>Application Tracker</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>💰</Text>
          <Text style={styles.menuText}>Refer a Friend</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>⚙️</Text>
          <Text style={styles.menuText}>Settings</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>📝</Text>
          <Text style={styles.menuText}>Terms of Service</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>🔒</Text>
          <Text style={styles.menuText}>Privacy Policy</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Version 1.0.0</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  loadingText: { textAlign: 'center', marginTop: 100, fontSize: 16, color: '#888' },
  profileHeader: { backgroundColor: '#1a3a5c', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 24, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  profileTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  profileAvatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#cc2936', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  avatarText: { fontSize: 24, fontWeight: 'bold', color: '#ffffff' },
  profileInfo: { flex: 1 },
  userName: { fontSize: 22, fontWeight: 'bold', color: '#ffffff', marginBottom: 2 },
  userLocation: { fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 8 },
  goalBadge: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start' },
  goalText: { fontSize: 11, color: '#ffffff' },
  counselorCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 14, padding: 14 },
  counselorLeft: { flexDirection: 'row', alignItems: 'center' },
  counselorAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1a3a5c', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  counselorAvatarText: { fontSize: 18, fontWeight: 'bold', color: '#ffffff' },
  counselorName: { fontSize: 15, fontWeight: '600', color: '#1a3a5c' },
  counselorRole: { fontSize: 12, color: '#888888' },
  bookSessionBtn: { backgroundColor: '#cc2936', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 14 },
  bookSessionText: { color: '#ffffff', fontSize: 12, fontWeight: '600' },
  menuSection: { flex: 1, paddingTop: 8 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  menuIcon: { fontSize: 18, marginRight: 14 },
  menuText: { flex: 1, fontSize: 15, color: '#1a3a5c' },
  menuArrow: { fontSize: 22, color: '#cccccc' },
  logoutButton: { marginHorizontal: 20, marginTop: 10, paddingVertical: 14, alignItems: 'center' },
  logoutText: { fontSize: 15, color: '#cc2936', fontWeight: '500' },
  version: { textAlign: 'center', fontSize: 11, color: '#aaaaaa', paddingBottom: 30 },
});

export default ProfileScreen;
