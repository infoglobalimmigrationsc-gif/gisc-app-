// frontend/src/screens/dashboard/HomeScreen.jsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'https://api.gisc-liberia.com/api';

const HomeScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [featuredUniversities, setFeaturedUniversities] = useState([
    {
      id: 1,
      name: 'University of Toronto',
      country: 'Canada',
      employability: '95%',
      image: 'toronto',
      scholarships: 'Up to 50%',
    },
    {
      id: 2,
      name: 'Arizona State University',
      country: 'USA',
      employability: '92%',
      image: 'asu',
      scholarships: 'Up to $15,000',
    },
    {
      id: 3,
      name: 'University of Birmingham',
      country: 'UK',
      employability: '94%',
      image: 'birmingham',
      scholarships: 'Up to £5,000',
    },
    {
      id: 4,
      name: 'Conestoga College',
      country: 'Canada',
      employability: '89%',
      image: 'conestoga',
      scholarships: 'Up to CAD 3,000',
    },
  ]);

  const [popularDestinations] = useState([
    { name: 'United States', institutions: 127, flag: '🇺🇸', code: 'usa' },
    { name: 'Canada', institutions: 98, flag: '🇨🇦', code: 'canada' },
    { name: 'United Kingdom', institutions: 112, flag: '🇬🇧', code: 'uk' },
    { name: 'Germany', institutions: 76, flag: '🇩🇪', code: 'germany' },
    { name: 'France', institutions: 54, flag: '🇫🇷', code: 'france' },
    { name: 'Spain', institutions: 42, flag: '🇪🇸', code: 'spain' },
    { name: 'Malta', institutions: 15, flag: '🇲🇹', code: 'malta' },
    { name: 'Dubai', institutions: 28, flag: '🇦🇪', code: 'uae' },
  ]);

  const [trendingCourses] = useState([
    { name: 'Business Administration', level: 'MBA', salary: 'CAD 15,580' },
    { name: 'Computer Science', level: 'Bachelor', salary: '$25,000' },
    { name: 'Data Science', level: 'Master', salary: '€18,500' },
    { name: 'Nursing', level: 'Bachelor', salary: '£12,000' },
    { name: 'Engineering', level: 'Master', salary: '$22,000' },
    { name: 'Finance', level: 'Bachelor', salary: '€15,000' },
  ]);

  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userStr = await AsyncStorage.getItem('gisc_user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setUserName(user.fullName?.split(' ')[0] || 'Student');
        setUserProfile(user);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserData();
    // Fetch updated data from API
    setRefreshing(false);
  };

  const handleStartApplication = () => {
    navigation.navigate('ApplicationLock');
  };

  const handleCountrySelect = (country) => {
    navigation.navigate('CountryDetail', { country });
  };

  const handleCourseSelect = (course) => {
    navigation.navigate('CourseDetail', { course });
  };

  const handleUniversitySelect = (university) => {
    navigation.navigate('UniversityDetail', { university });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {userName}! 👋</Text>
          <Text style={styles.subGreeting}>Your study abroad journey starts here</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
          <View style={styles.notificationBadge}>
            <Ionicons name="notifications-outline" size={24} color="#1E3A5F" />
            <View style={styles.badge} />
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Search Bar */}
        <TouchableOpacity 
          style={styles.searchBar}
          onPress={() => navigation.navigate('Search')}
        >
          <Ionicons name="search-outline" size={20} color="#8AA0B8" />
          <Text style={styles.searchPlaceholder}>
            Search courses, universities...
          </Text>
        </TouchableOpacity>

        {/* Urgency Banner */}
        <View style={styles.urgencyBanner}>
          <View style={styles.urgencyContent}>
            <Text style={styles.urgencyTitle}>🎓 Fall 2026 Intake</Text>
            <Text style={styles.urgencySubtitle}>Secure your spot now!</Text>
            <View style={styles.urgencyTag}>
              <Text style={styles.urgencyTagText}>🔑 LAST FEW SLOTS LEFT</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.urgencyButton}
            onPress={handleStartApplication}
          >
            <Text style={styles.urgencyButtonText}>Book your slot →</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>500+</Text>
            <Text style={styles.statLabel}>Students Placed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>97%</Text>
            <Text style={styles.statLabel}>Visa Success</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>$2M+</Text>
            <Text style={styles.statLabel}>Scholarships Secured</Text>
          </View>
        </View>

        {/* Popular Destinations */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Destinations</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AllCountries')}>
              <Text style={styles.seeAll}>See All →</Text>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            {popularDestinations.map((dest, index) => (
              <TouchableOpacity
                key={index}
                style={styles.destinationCard}
                onPress={() => handleCountrySelect(dest)}
              >
                <Text style={styles.destinationFlag}>{dest.flag}</Text>
                <Text style={styles.destinationName}>{dest.name}</Text>
                <Text style={styles.destinationCount}>{dest.institutions} Institutions</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Universities */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Institutions</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AllUniversities')}>
              <Text style={styles.seeAll}>See All →</Text>
            </TouchableOpacity>
          </View>
          {featuredUniversities.map((uni) => (
            <TouchableOpacity
              key={uni.id}
              style={styles.universityCard}
              onPress={() => handleUniversitySelect(uni)}
            >
              <View style={styles.universityImagePlaceholder}>
                <Ionicons name="business-outline" size={40} color="#1E3A5F" />
              </View>
              <View style={styles.universityInfo}>
                <Text style={styles.universityName}>{uni.name}</Text>
                <Text style={styles.universityCountry}>{uni.country}</Text>
                <View style={styles.universityStats}>
                  <View style={styles.employabilityTag}>
                    <Ionicons name="trending-up" size={12} color="#27AE60" />
                    <Text style={styles.employabilityText}>{uni.employability} Employability</Text>
                  </View>
                  <View style={styles.scholarshipTag}>
                    <Ionicons name="cash-outline" size={12} color="#F39C12" />
                    <Text style={styles.scholarshipText}>{uni.scholarships}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Trending Subjects */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trending Subjects</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AllCourses')}>
              <Text style={styles.seeAll}>See All →</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.subjectsGrid}>
            {trendingCourses.map((course, index) => (
              <TouchableOpacity
                key={index}
                style={styles.subjectChip}
                onPress={() => handleCourseSelect(course)}
              >
                <Text style={styles.subjectName}>{course.name}</Text>
                <Text style={styles.subjectLevel}>{course.level}</Text>
                <Text style={styles.subjectSalary}>{course.salary}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Referral Banner */}
        <View style={styles.referralBanner}>
          <View style={styles.referralContent}>
            <Text style={styles.referralTitle}>💰 Refer a Friend</Text>
            <Text style={styles.referralText}>
              They enroll, you earn GBP 250!
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.referralButton}
            onPress={() => navigation.navigate('Referral')}
          >
            <Text style={styles.referralButtonText}>Refer Now →</Text>
          </TouchableOpacity>
        </View>

        {/* Stays Banner */}
        <View style={styles.staysBanner}>
          <Ionicons name="home-outline" size={24} color="#1E3A5F" />
          <View style={styles.staysContent}>
            <Text style={styles.staysTitle}>Student Accommodation</Text>
            <Text style={styles.staysText}>
              Budget homes to private studios in 450+ cities
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Stays')}>
            <Ionicons name="chevron-forward" size={24} color="#1E3A5F" />
          </TouchableOpacity>
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Ready to Study Abroad?</Text>
          <Text style={styles.ctaText}>
            Get personalized guidance from our expert counselors
          </Text>
          <TouchableOpacity 
            style={styles.ctaButton}
            onPress={handleStartApplication}
          >
            <Text style={styles.ctaButtonText}>Start Your Application →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E3A5F',
  },
  subGreeting: {
    fontSize: 14,
    color: '#5A7D9C',
    marginTop: 4,
  },
  notificationBadge: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E74C3C',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F9FF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E8EEF5',
  },
  searchPlaceholder: {
    marginLeft: 12,
    fontSize: 15,
    color: '#8AA0B8',
  },
  urgencyBanner: {
    backgroundColor: '#1E3A5F',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  urgencyContent: {
    marginBottom: 16,
  },
  urgencyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  urgencySubtitle: {
    fontSize: 16,
    color: '#A8D0E6',
    marginTop: 4,
  },
  urgencyTag: {
    backgroundColor: '#E74C3C',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  urgencyTagText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  urgencyButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  urgencyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E3A5F',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F5F9FF',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8EEF5',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E3A5F',
  },
  statLabel: {
    fontSize: 11,
    color: '#5A7D9C',
    textAlign: 'center',
    marginTop: 4,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E3A5F',
  },
  seeAll: {
    fontSize: 14,
    color: '#1E3A5F',
    fontWeight: '500',
  },
  horizontalScroll: {
    marginLeft: -4,
  },
  destinationCard: {
    backgroundColor: '#F5F9FF',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    minWidth: 130,
    borderWidth: 1,
    borderColor: '#E8EEF5',
  },
  destinationFlag: {
    fontSize: 32,
    marginBottom: 8,
  },
  destinationName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E3A5F',
  },
  destinationCount: {
    fontSize: 12,
    color: '#5A7D9C',
    marginTop: 4,
  },
  universityCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8EEF5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  universityImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#EBF3FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  universityInfo: {
    flex: 1,
  },
  universityName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E3A5F',
  },
  universityCountry: {
    fontSize: 13,
    color: '#5A7D9C',
    marginTop: 2,
  },
  universityStats: {
    flexDirection: 'row',
    marginTop: 8,
  },
  employabilityTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F8F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  employabilityText: {
    fontSize: 11,
    color: '#27AE60',
    marginLeft: 4,
  },
  scholarshipTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF9E7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scholarshipText: {
    fontSize: 11,
    color: '#F39C12',
    marginLeft: 4,
  },
  subjectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  subjectChip: {
    width: '48%',
    backgroundColor: '#F5F9FF',
    borderRadius: 12,
    padding: 14,
    margin: 4,
    borderWidth: 1,
    borderColor: '#E8EEF5',
  },
  subjectName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E3A5F',
  },
  subjectLevel: {
    fontSize: 12,
    color: '#5A7D9C',
    marginTop: 4,
  },
  subjectSalary: {
    fontSize: 13,
    fontWeight: '600',
    color: '#27AE60',
    marginTop: 6,
  },
  referralBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  referralContent: {
    flex: 1,
  },
  referralTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E3A5F',
  },
  referralText: {
    fontSize: 13,
    color: '#5A7D9C',
    marginTop: 2,
  },
  referralButton: {
    backgroundColor: '#1E3A5F',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  referralButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
  },
  staysBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F9FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E8EEF5',
  },
  staysContent: {
    flex: 1,
    marginLeft: 12,
  },
  staysTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E3A5F',
  },
  staysText: {
    fontSize: 12,
    color: '#5A7D9C',
    marginTop: 2,
  },
  ctaSection: {
    backgroundColor: '#1E3A5F',
    borderRadius: 16,
    padding: 24,
    marginBottom: 30,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  ctaText: {
    fontSize: 14,
    color: '#A8D0E6',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  ctaButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E3A5F',
  },
});

export default HomeScreen;
