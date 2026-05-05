// frontend/src/screens/dashboard/HomeScreen.jsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';

const HomeScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [featuredCourses, setFeaturedCourses] = useState([
    {
      id: 1,
      name: 'AEC in Business Management',
      institution: 'LaSalle College',
      country: 'Canada',
      tuition: 'CAD 13,800',
      difficulty: 'TOUGH TO GET IN',
      difficultyColor: '#E74C3C',
      type: 'Certifications',
    },
    {
      id: 2,
      name: 'Certificate Business Administration',
      institution: 'Bow Valley College',
      country: 'Canada',
      tuition: 'CAD 16,492',
      difficulty: 'EASY TO GET IN',
      difficultyColor: '#27AE60',
      type: 'Certificate',
    },
    {
      id: 3,
      name: 'Certificate in Business',
      institution: 'University of Prince Edward Island',
      country: 'Canada',
      tuition: 'CAD 15,580',
      difficulty: 'GIVE IT A TRY',
      difficultyColor: '#F39C12',
      type: 'Certificate',
    },
  ]);

  const popularDestinations = [
    { name: 'United Kingdom', institutions: 113, flag: '🇬🇧' },
    { name: 'United States', institutions: 131, flag: '🇺🇸' },
    { name: 'Canada', institutions: 37, flag: '🇨🇦' },
  ];

  const trendingSubjects = [
    'Business', 'Business Administration', 'Education', 
    'Computer Sciences', 'Law', 'Finance'
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
    } catch (error) {
      console.error('Error loading user:', error);
    }
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
        <View style={styles.headerLeft}>
          <View style={styles.logoSmall}>
            <Text style={styles.logoSmallText}>GISC</Text>
          </View>
          <Text style={styles.headerTitle}>Find Courses and Institutions</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {userName?.charAt(0)?.toUpperCase() || 'D'}
            </Text>
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
        {/* IELTS/Services Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>🎓 Ready to Study Abroad?</Text>
            <Text style={styles.bannerSubtitle}>
              Expert-led | Affordable | High Success Rate
            </Text>
          </View>
          <TouchableOpacity style={styles.bannerButton}>
            <Text style={styles.bannerButtonText}>Learn more</Text>
          </TouchableOpacity>
        </View>

        {/* Success Rate Card */}
        <View style={styles.successCard}>
          <Text style={styles.successLabel}>Visa Success Rate</Text>
          <Text style={styles.successScore}>97%</Text>
          <Text style={styles.successRating}>Excellent</Text>
        </View>

        {/* Popular Destinations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Destinations</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {popularDestinations.map((dest, index) => (
              <TouchableOpacity key={index} style={styles.destinationCard}>
                <Text style={styles.destinationFlag}>{dest.flag}</Text>
                <Text style={styles.destinationName}>{dest.name}</Text>
                <Text style={styles.destinationCount}>{dest.institutions} Institutions</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Genie's Matches Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🎯 Recommended Matches</Text>
            <TouchableOpacity>
              <Text style={styles.infoLink}>What's this? ⓘ</Text>
            </TouchableOpacity>
          </View>

          {/* Difficulty Filter Chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
            <TouchableOpacity style={[styles.filterChip, styles.filterChipActive]}>
              <Text style={[styles.filterChipText, styles.filterChipTextActive]}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterChip}>
              <Text style={styles.filterChipText}>Easy to get in</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterChip}>
              <Text style={styles.filterChipText}>Give it a try</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterChip}>
              <Text style={styles.filterChipText}>Tougher than average</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Course Cards */}
          {featuredCourses.map((course) => (
            <TouchableOpacity key={course.id} style={styles.courseCard}>
              <View style={styles.courseCardHeader}>
                <View style={[styles.difficultyBadge, { backgroundColor: course.difficultyColor + '20' }]}>
                  <Text style={[styles.difficultyText, { color: course.difficultyColor }]}>
                    {course.difficulty}
                  </Text>
                </View>
                <Text style={styles.courseType}>{course.type}</Text>
              </View>
              
              <Text style={styles.courseName}>{course.name}</Text>
              
              <View style={styles.courseDetails}>
                <Text style={styles.institutionName}>📍 {course.institution}</Text>
                <Text style={styles.courseCountry}>{course.country}</Text>
              </View>
              
              <View style={styles.courseFooter}>
                <Text style={styles.tuition}>{course.tuition}</Text>
                <TouchableOpacity style={styles.applyButton}>
                  <Text style={styles.applyButtonText}>View Details</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Top Institutions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Institutions</Text>
          <TouchableOpacity style={styles.institutionCard}>
            <View style={styles.institutionIcon}>
              <Text style={styles.institutionIconText}>TRU</Text>
            </View>
            <View style={styles.institutionInfo}>
              <Text style={styles.institutionName}>Thompson Rivers University</Text>
              <Text style={styles.institutionCountry}>Canada</Text>
            </View>
            <Text style={styles.institutionArrow}>→</Text>
          </TouchableOpacity>
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

        {/* Stays Banner */}
        <View style={styles.staysBanner}>
          <View style={styles.staysContent}>
            <Text style={styles.staysTitle}>🏠 Student Accommodation</Text>
            <Text style={styles.staysText}>
              Budget homes to private studios in 450+ global cities
            </Text>
          </View>
          <Text style={styles.staysArrow}>→</Text>
        </View>

        {/* Referral Banner */}
        <View style={styles.referralBanner}>
          <View>
            <Text style={styles.referralTitle}>Here's $250</Text>
            <Text style={styles.referralText}>
              Refer a friend to GISC. They enrol, the reward is yours
            </Text>
          </View>
          <TouchableOpacity style={styles.referralButton}>
            <Text style={styles.referralButtonText}>Refer now</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 14,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoSmall: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#cc2936',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  logoSmallText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a3a5c',
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1a3a5c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  banner: {
    backgroundColor: '#1a3a5c',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    marginBottom: 16,
  },
  bannerContent: {
    marginBottom: 14,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 13,
    color: '#c0c0c0',
  },
  bannerButton: {
    backgroundColor: '#cc2936',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  successCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  successLabel: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 4,
  },
  successScore: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#27AE60',
  },
  successRating: {
    fontSize: 14,
    color: '#27AE60',
    fontWeight: '500',
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a3a5c',
    marginBottom: 14,
  },
  infoLink: {
    fontSize: 13,
    color: '#888888',
  },
  destinationCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 14,
    padding: 16,
    marginRight: 12,
    minWidth: 140,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  destinationFlag: {
    fontSize: 36,
    marginBottom: 8,
  },
  destinationName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a3a5c',
  },
  destinationCount: {
    fontSize: 12,
    color: '#888888',
    marginTop: 4,
  },
  filterRow: {
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterChipActive: {
    backgroundColor: '#1a3a5c',
    borderColor: '#1a3a5c',
  },
  filterChipText: {
    fontSize: 13,
    color: '#666666',
  },
  filterChipTextActive: {
    color: '#ffffff',
    fontWeight: '500',
  },
  courseCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  courseCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  courseType: {
    fontSize: 12,
    color: '#888888',
  },
  courseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a3a5c',
    marginBottom: 8,
  },
  courseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  institutionName: {
    fontSize: 13,
    color: '#666666',
  },
  courseCountry: {
    fontSize: 13,
    color: '#888888',
  },
  courseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  tuition: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a3a5c',
  },
  applyButton: {
    backgroundColor: '#cc2936',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  applyButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  institutionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  institutionIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#1a3a5c',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  institutionIconText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  institutionInfo: {
    flex: 1,
  },
  institutionCountry: {
    fontSize: 12,
    color: '#888888',
    marginTop: 2,
  },
  institutionArrow: {
    fontSize: 20,
    color: '#888888',
  },
  subjectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  subjectChip: {
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  subjectText: {
    fontSize: 13,
    color: '#1a3a5c',
    fontWeight: '500',
  },
  staysBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  staysContent: {
    flex: 1,
  },
  staysTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a3a5c',
    marginBottom: 4,
  },
  staysText: {
    fontSize: 12,
    color: '#888888',
  },
  staysArrow: {
    fontSize: 20,
    color: '#888888',
  },
  referralBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: 14,
    padding: 16,
    marginBottom: 30,
  },
  referralTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a3a5c',
  },
  referralText: {
    fontSize: 13,
    color: '#666666',
    marginTop: 2,
  },
  referralButton: {
    backgroundColor: '#cc2936',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  referralButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default HomeScreen;
