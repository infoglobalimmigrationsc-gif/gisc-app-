// frontend/src/screens/profile/ProfileScreen.jsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';

const ProfileScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('gisc_token');
      const response = await api.get('/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setUser(response.data.user);
        setFormData(response.data.user);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Welcome' }],
            });
          },
        },
      ]
    );
  };

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem('gisc_token');
      await api.put('/auth/profile', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(formData);
      setEditing(false);
      Alert.alert('Success', 'Profile updated successfully.');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  const renderBasicInfo = () => (
    <View style={styles.tabContent}>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Full name</Text>
        <Text style={styles.inputHint}>As per your passport or ID proof</Text>
        <TextInput
          style={styles.input}
          value={formData.fullName}
          onChangeText={(t) => setFormData({ ...formData, fullName: t })}
          editable={editing}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Country</Text>
        <TextInput
          style={styles.input}
          value={formData.country || formData.profile?.country}
          onChangeText={(t) => setFormData({ ...formData, country: t })}
          editable={editing}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>City</Text>
        <TextInput
          style={styles.input}
          value={formData.city}
          onChangeText={(t) => setFormData({ ...formData, city: t })}
          editable={editing}
          placeholder="Enter your city"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Nationality</Text>
        <TextInput
          style={styles.input}
          value={formData.nationality}
          onChangeText={(t) => setFormData({ ...formData, nationality: t })}
          editable={editing}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Date of birth</Text>
        <TextInput
          style={styles.input}
          value={formData.dateOfBirth}
          onChangeText={(t) => setFormData({ ...formData, dateOfBirth: t })}
          editable={editing}
          placeholder="DD/MM/YYYY"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Email Address</Text>
        <TextInput
          style={[styles.input, styles.inputDisabled]}
          value={formData.email}
          editable={false}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>📞 Phone Number</Text>
        <TextInput
          style={styles.input}
          value={formData.phone}
          onChangeText={(t) => setFormData({ ...formData, phone: t })}
          editable={editing}
          keyboardType="phone-pad"
        />
      </View>

      {editing ? (
        <View style={styles.editButtons}>
          <TouchableOpacity
            style={styles.cancelEditButton}
            onPress={() => {
              setFormData(user);
              setEditing(false);
            }}
          >
            <Text style={styles.cancelEditText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );

  const renderQualifications = () => (
    <View style={styles.tabContent}>
      <View style={styles.qualificationCard}>
        <Text style={styles.qualTitle}>Academic qualification</Text>
        <Text style={styles.qualValue}>
          {user?.profile?.highestQualification || 'Senior High School'}
        </Text>
      </View>

      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>+ Add Academic Qualification</Text>
      </TouchableOpacity>

      <View style={styles.sectionDivider} />

      <View style={styles.qualificationCard}>
        <Text style={styles.qualTitle}>English Language</Text>
        <Text style={styles.qualValue}>
          {user?.profile?.englishProficiency || 'Not specified'}
        </Text>
      </View>

      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>+ Add English Language</Text>
      </TouchableOpacity>

      <View style={styles.sectionDivider} />

      <View style={styles.qualificationCard}>
        <Text style={styles.qualTitle}>Standardized Test</Text>
        <Text style={styles.qualValue}>None added</Text>
      </View>

      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>+ Add Standardized Test</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPreferences = () => (
    <View style={styles.tabContent}>
      <View style={styles.prefItem}>
        <Text style={styles.prefLabel}>Preferred destination</Text>
        <Text style={styles.prefValue}>
          {user?.profile?.preferredCountry || 'Not set'}
        </Text>
      </View>

      <View style={styles.prefItem}>
        <Text style={styles.prefLabel}>Start year</Text>
        <Text style={styles.prefValue}>2026</Text>
      </View>

      <View style={styles.prefItem}>
        <Text style={styles.prefLabel}>Start month</Text>
        <Text style={styles.prefValue}>July - Sept</Text>
      </View>

      <View style={styles.prefItem}>
        <Text style={styles.prefLabel}>Preferred study level</Text>
        <Text style={styles.prefValue}>
          {user?.profile?.studyLevel || 'Undergraduate'}
        </Text>
      </View>

      <View style={styles.sectionDivider} />

      <Text style={styles.prefSectionTitle}>PREFERRED SUBJECTS</Text>
      
      <View style={styles.subjectsContainer}>
        {user?.profile?.courseOfStudy ? (
          <View style={styles.subjectChip}>
            <Text style={styles.subjectChipText}>{user.profile.courseOfStudy}</Text>
            <Text style={styles.subjectRemove}>✖</Text>
          </View>
        ) : (
          <Text style={styles.noSubjects}>No subjects selected</Text>
        )}
      </View>

      <TouchableOpacity style={styles.searchSubjects}>
        <Text style={styles.searchSubjectsText}>🔍 Search Subjects</Text>
      </TouchableOpacity>
    </View>
  );

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
        <Text style={styles.userName}>{user.fullName}</Text>
        <Text style={styles.userLocation}>{user.country || 'Liberia'}</Text>
        
        {user.profile?.preferredCountry && (
          <View style={styles.studyPreference}>
            <Text style={styles.studyPrefText}>
              Looking for a{' '}
              <Text style={styles.studyPrefBold}>
                {user.profile.studyLevel || 'Undergraduate'} Course in {user.profile.courseOfStudy || 'Business'}
              </Text>
              {' '}by July 2026 in{' '}
              <Text style={styles.studyPrefBold}>{user.profile.preferredCountry}</Text>
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setEditing(!editing)}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>

        {/* Counselor Card */}
        <View style={styles.counselorCard}>
          <View style={styles.counselorAvatar}>
            <Text style={styles.counselorAvatarText}>F</Text>
          </View>
          <View style={styles.counselorInfo}>
            <Text style={styles.counselorName}>Faith Isikwei</Text>
            <Text style={styles.counselorRole}>Senior Counsellor</Text>
          </View>
          <TouchableOpacity
            style={styles.sessionButton}
            onPress={() => navigation.navigate('Meet')}
          >
            <Text style={styles.sessionButtonText}>Book a Session</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabBar}>
        {['basic', 'qualifications', 'preferences'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabItem, activeTab === tab && styles.tabItemActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabItemText, activeTab === tab && styles.tabItemTextActive]}>
              {tab === 'basic' ? 'Basic information' : tab === 'qualifications' ? 'Qualifications' : 'Preferences'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'basic' && renderBasicInfo()}
        {activeTab === 'qualifications' && renderQualifications()}
        {activeTab === 'preferences' && renderPreferences()}
      </ScrollView>

      {/* Menu Items */}
      <View style={styles.menuSection}>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('DocumentUpload')}>
          <Text style={styles.menuItemText}>📄 Documents</Text>
          <Text style={styles.menuArrow}>→</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>⭐ Shortlist</Text>
          <Text style={styles.menuArrow}>→</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>💰 Refer Now</Text>
          <Text style={styles.menuArrow}>→</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>📝 Give us feedback</Text>
          <Text style={styles.menuArrow}>→</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>⚙️ Settings</Text>
          <Text style={styles.menuArrow}>→</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>📋 Terms Of Service</Text>
          <Text style={styles.menuArrow}>→</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>🔒 Privacy Policy</Text>
          <Text style={styles.menuArrow}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>

      {/* Version */}
      <Text style={styles.version}>VERSION 1.0.0</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 100,
    fontSize: 16,
    color: '#888888',
  },
  profileHeader: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#1a3a5c',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  userLocation: {
    fontSize: 14,
    color: '#c0c0c0',
    marginBottom: 12,
  },
  studyPreference: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  studyPrefText: {
    fontSize: 12,
    color: '#ffffff',
    lineHeight: 18,
  },
  studyPrefBold: {
    fontWeight: '600',
  },
  editButton: {
    position: 'absolute',
    top: 60,
    right: 20,
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  counselorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
  },
  counselorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1a3a5c',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  counselorAvatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  counselorInfo: {
    flex: 1,
  },
  counselorName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a3a5c',
  },
  counselorRole: {
    fontSize: 12,
    color: '#888888',
  },
  sessionButton: {
    backgroundColor: '#cc2936',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  sessionButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tabItem: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  tabItemActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#cc2936',
  },
  tabItemText: {
    fontSize: 13,
    color: '#888888',
    fontWeight: '500',
  },
  tabItemTextActive: {
    color: '#cc2936',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 4,
  },
  inputHint: {
    fontSize: 11,
    color: '#aaaaaa',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1a3a5c',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  inputDisabled: {
    backgroundColor: '#eeeeee',
    color: '#888888',
  },
  editButtons: {
    flexDirection: 'row',
    marginTop: 20,
  },
  cancelEditButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 10,
  },
  cancelEditText: {
    color: '#888888',
    fontWeight: '500',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#cc2936',
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 10,
  },
  saveButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  qualificationCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
  },
  qualTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a3a5c',
    marginBottom: 4,
  },
  qualValue: {
    fontSize: 13,
    color: '#666666',
  },
  addButton: {
    paddingVertical: 12,
    marginBottom: 10,
  },
  addButtonText: {
    fontSize: 14,
    color: '#cc2936',
    fontWeight: '500',
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
  prefItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  prefLabel: {
    fontSize: 14,
    color: '#666666',
  },
  prefValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a3a5c',
  },
  prefSectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888888',
    marginBottom: 12,
    letterSpacing: 1,
  },
  subjectsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  subjectChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a3a5c',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  subjectChipText: {
    fontSize: 13,
    color: '#ffffff',
    marginRight: 6,
  },
  subjectRemove: {
    fontSize: 14,
    color: '#c0c0c0',
  },
  noSubjects: {
    fontSize: 14,
    color: '#888888',
    fontStyle: 'italic',
  },
  searchSubjects: {
    marginTop: 12,
  },
  searchSubjectsText: {
    fontSize: 14,
    color: '#cc2936',
    fontWeight: '500',
  },
  menuSection: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  menuItemText: {
    fontSize: 15,
    color: '#1a3a5c',
  },
  menuArrow: {
    fontSize: 16,
    color: '#888888',
  },
  logoutButton: {
    marginHorizontal: 20,
    marginTop: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 15,
    color: '#cc2936',
    fontWeight: '500',
  },
  version: {
    textAlign: 'center',
    fontSize: 11,
    color: '#aaaaaa',
    paddingBottom: 30,
  },
});

export default ProfileScreen;
