// frontend/src/screens/dashboard/HomeScreen.jsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const popularDestinations = [
    { name: 'United Kingdom', institutions: 113, flag: 'uk' },
    { name: 'United States', institutions: 131, flag: 'us' },
    { name: 'Canada', institutions: 37, flag: 'ca' },
    { name: 'Germany', institutions: 45, flag: 'de' },
  ];

  const featuredPrograms = [
    {
      id: 1,
      title: 'Business Administration',
      institution: 'Thompson Rivers University',
      location: 'Canada',
      tuition: 'CAD 16,492 / year',
      admission: 'Easy Admission',
      admissionColor: '#27AE60',
      level: 'Undergraduate',
    },
    {
      id: 2,
      title: 'Computer Science',
      institution: 'Bow Valley College',
      location: 'Canada',
      tuition: 'CAD 14,400 / year',
      admission: 'Moderate',
      admissionColor: '#F39C12',
      level: 'Diploma',
    },
    {
      id: 3,
      title: 'International Business',
      institution: 'University of Prince Edward Island',
      location: 'Canada',
      tuition: 'CAD 15,580 / year',
      admission: 'Easy Admission',
      admissionColor: '#27AE60',
      level: 'Certificate',
    },
  ];

  const trendingSubjects = [
    'Business', 'Computer Science', 'Engineering', 
    'Nursing', 'Data Science', 'Finance'
  ];

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userStr = await AsyncStorage.getItem('gisc_user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setUserName(user.fullName?.split(' ')[0] || 'Student');
      }
    } catch (error) {}
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserData();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <View style={styles.logoSmall}>
              <Text style={styles.logoSmallText}>G</Text>
            </View>
            <View>
              <Text style={styles.greeting}>Hello, {userName || 'Student'}</Text>
              <Text style={styles.headerSubtitle}>Find your dream university</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {userName?.charAt(0)?.toUpperCase() || 'S'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <TouchableOpacity style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchPlaceholder}>Search courses or universities...</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Main Banner */}
        <View style={styles.mainBanner}>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerBadge}>FALL 2026 INTAKE</Text>
            <Text style={styles.bannerTitle}>Secure Your Place at a Top University</Text>
            <Text style={styles.bannerText}>
              Get expert guidance on admissions, scholarships, and visa processing
            </Text>
            <TouchableOpacity 
              style={styles.bannerButton}
              onPress={() => navigation.navigate('ApplicationLock')}
            >
              <Text style={styles.bannerButtonText}>Start Application</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Success Stats */}
        <View style={styles.statsStrip}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>97%</Text>
            <Text style={styles.statLabel}>Visa Success Rate</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>500+</Text>
            <Text style={styles.statLabel}>Students Placed</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>$2M+</Text>
            <Text style={styles.statLabel}>Scholarships Secured</Text>
          </View>
        </View>

        {/* Popular Destinations */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Destinations</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {popularDestinations.map((dest, index) => (
              <TouchableOpacity key={index} style={styles.destinationCard}>
                <View style={styles.destinationFlag}>
                  <Text style={styles.flagText}>{dest.flag === 'uk' ? '🇬🇧' : dest.flag === 'us' ? '🇺🇸' : dest.flag === 'ca' ? '🇨🇦' : '🇩🇪'}</Text>
                </View>
                <Text style={styles.destinationName}>{dest.name}</Text>
                <Text style={styles.destinationCount}>{dest.institutions} Institutions</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Programs */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Programs</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>View All</Text>
            </TouchableOpacity>
          </View>
          {featuredPrograms.map((program) => (
            <TouchableOpacity key={program.id} style={styles.programCard}>
              <View style={styles.programCardTop}>
                <View style={styles.programLevel}>
                  <Text style={styles.programLevelText}>{program.level}</Text>
                </View>
                <View style={[styles.admissionBadge, { backgroundColor: program.admissionColor + '18' }]}>
                  <Text style={[styles.admissionText, { color: program.admissionColor }]}>
                    {program.admission}
                  </Text>
                </View>
              </View>
              <Text style={styles.programTitle}>{program.title}</Text>
              <Text style={styles.programInstitution}>{program.institution}</Text>
              <View style={styles.programFooter}>
                <View style={styles.locationBadge}>
                  <Text style={styles.locationText}>{program.location}</Text>
                </View>
                <Text style={styles.tuitionText}>{program.tuition}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Trending Subjects */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trending Subjects</Text>
          <View style={styles.subjectsGrid}>
            {trendingSubjects.map((subject, index) => (
              <TouchableOpacity key={index} style={styles.subjectChip}>
                <Text style={styles.subjectText}>{subject}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Referral Banner */}
        <View style={styles.referralCard}>
          <View style={styles.referralContent}>
            <Text style={styles.referralTitle}>Refer a Friend</Text>
            <Text style={styles.referralSubtitle}>Earn $250 when they enroll</Text>
          </View>
          <TouchableOpacity style={styles.referralButton}>
            <Text style={styles.referralButtonText}>Refer Now</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom CTA */}
        <View style={styles.bottomCTA}>
          <Text style={styles.bottomCTATitle}>Ready to Begin Your Journey?</Text>
          <Text style={styles.bottomCTASubtitle}>Start your application today and take the first step toward studying abroad.</Text>
          <TouchableOpacity 
            style={styles.bottomCTAButton}
            onPress={() => navigation.navigate('ApplicationLock')}
          >
            <Text style={styles.bottomCTAButtonText}>Start Your Application</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: { paddingHorizontal: 20, paddingTop: 55, paddingBottom: 16, backgroundColor: '#ffffff' },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  logoSmall: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#1a3a5c', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  logoSmallText: { fontSize: 18, fontWeight: 'bold', color: '#ffffff' },
  greeting: { fontSize: 18, fontWeight: '600', color: '#1a3a5c' },
  headerSubtitle: { fontSize: 13, color: '#888888', marginTop: 2 },
  profileButton: {},
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#cc2936', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 16, fontWeight: '600', color: '#ffffff' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, borderWidth: 1, borderColor: '#e8e8e8' },
  searchIcon: { fontSize: 16, marginRight: 10 },
  searchPlaceholder: { fontSize: 15, color: '#999999' },
  scrollView: { flex: 1 },
  mainBanner: { backgroundColor: '#1a3a5c', borderRadius: 20, padding: 24, marginHorizontal: 20, marginTop: 20, marginBottom: 16 },
  bannerContent: {},
  bannerBadge: { backgroundColor: '#cc2936', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, alignSelf: 'flex-start', marginBottom: 16 },
  bannerTitle: { fontSize: 22, fontWeight: 'bold', color: '#ffffff', marginBottom: 8 },
  bannerText: { fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 20, marginBottom: 20 },
  bannerButton: { backgroundColor: '#ffffff', borderRadius: 10, paddingVertical: 12, paddingHorizontal: 20, alignSelf: 'flex-start' },
  bannerButtonText: { fontSize: 14, fontWeight: '600', color: '#1a3a5c' },
  statsStrip: { flexDirection: 'row', marginHorizontal: 20, marginBottom: 28, backgroundColor: '#f8fafc', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#e8eef5' },
  statBox: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#1a3a5c', marginBottom: 4 },
  statLabel: { fontSize: 11, color: '#888888', textAlign: 'center' },
  section: { marginBottom: 28, paddingHorizontal: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#1a3a5c' },
  seeAll: { fontSize: 14, fontWeight: '500', color: '#cc2936' },
  destinationCard: { backgroundColor: '#f8fafc', borderRadius: 14, padding: 16, marginRight: 12, minWidth: 130, borderWidth: 1, borderColor: '#e8eef5' },
  destinationFlag: { marginBottom: 10 },
  flagText: { fontSize: 32 },
  destinationName: { fontSize: 14, fontWeight: '600', color: '#1a3a5c' },
  destinationCount: { fontSize: 11, color: '#888888', marginTop: 4 },
  programCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 18, marginBottom: 14, borderWidth: 1, borderColor: '#e8eef5', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  programCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  programLevel: { backgroundColor: '#f0f4f8', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  programLevelText: { fontSize: 11, fontWeight: '500', color: '#1a3a5c' },
  admissionBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  admissionText: { fontSize: 11, fontWeight: '600' },
  programTitle: { fontSize: 17, fontWeight: '600', color: '#1a3a5c', marginBottom: 6 },
  programInstitution: { fontSize: 13, color: '#666666', marginBottom: 12 },
  programFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingTop: 12 },
  locationBadge: { flexDirection: 'row', alignItems: 'center' },
  locationText: { fontSize: 12, color: '#888888' },
  tuitionText: { fontSize: 14, fontWeight: '600', color: '#1a3a5c' },
  subjectsGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  subjectChip: { backgroundColor: '#f5f5f5', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, marginRight: 10, marginBottom: 10, borderWidth: 1, borderColor: '#e0e0e0' },
  subjectText: { fontSize: 13, color: '#1a3a5c', fontWeight: '500' },
  referralCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF8F0', borderRadius: 16, padding: 18, marginHorizontal: 20, marginBottom: 28, borderWidth: 1, borderColor: '#FFE8CC' },
  referralContent: {},
  referralTitle: { fontSize: 17, fontWeight: '600', color: '#1a3a5c' },
  referralSubtitle: { fontSize: 13, color: '#666666', marginTop: 2 },
  referralButton: { backgroundColor: '#cc2936', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 18 },
  referralButtonText: { color: '#ffffff', fontSize: 13, fontWeight: '600' },
  bottomCTA: { backgroundColor: '#1a3a5c', borderRadius: 20, padding: 28, marginHorizontal: 20, alignItems: 'center' },
  bottomCTATitle: { fontSize: 20, fontWeight: 'bold', color: '#ffffff', textAlign: 'center', marginBottom: 8 },
  bottomCTASubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.7)', textAlign: 'center', lineHeight: 20, marginBottom: 20 },
  bottomCTAButton: { backgroundColor: '#cc2936', borderRadius: 12, paddingVertical: 14, paddingHorizontal: 30 },
  bottomCTAButtonText: { color: '#ffffff', fontSize: 15, fontWeight: '600' },
});

export default HomeScreen;
