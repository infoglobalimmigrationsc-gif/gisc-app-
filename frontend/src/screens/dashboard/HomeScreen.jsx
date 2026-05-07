// frontend/src/screens/dashboard/HomeScreen.jsx
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Business', 'Computer Science', 'Engineering', 'Nursing', 'Data Science'];
  
  const popularDestinations = [
    { name: 'United Kingdom', institutions: 113, flag: 'uk' },
    { name: 'United States', institutions: 131, flag: 'us' },
    { name: 'Canada', institutions: 37, flag: 'ca' },
  ];

  const featuredPrograms = [
    {
      id: 1, title: 'Business Administration', institution: 'Thompson Rivers University',
      location: 'Canada', tuition: 'CAD 16,492/yr', admission: 'Moderate', admissionColor: '#F39C12',
      level: 'Undergraduate', premium: true,
    },
    {
      id: 2, title: 'Computer Science', institution: 'Bow Valley College',
      location: 'Canada', tuition: 'CAD 14,400/yr', admission: 'Easy', admissionColor: '#27AE60',
      level: 'Diploma', premium: false,
    },
    {
      id: 3, title: 'International Business', institution: 'University of Prince Edward Island',
      location: 'Canada', tuition: 'CAD 15,580/yr', admission: 'Easy', admissionColor: '#27AE60',
      level: 'Certificate', premium: false,
    },
  ];

  useEffect(() => {
    const loadUser = async () => {
      const userStr = await AsyncStorage.getItem('gisc_user');
      if (userStr) setUserName(JSON.parse(userStr).fullName?.split(' ')[0] || 'Student');
    };
    loadUser();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoSmall}>
            <Text style={styles.logoSmallText}>G</Text>
          </View>
          <View>
            <Text style={styles.greeting}>Hello, {userName || 'Student'}</Text>
            <Text style={styles.headerSubtitle}>Find Courses and Institutions</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{userName?.charAt(0)?.toUpperCase() || 'S'}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => {}} />}
      >
        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput style={styles.searchInput} placeholder="Search courses, universities..." placeholderTextColor="#999" />
        </View>

        {/* Category Icons */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesRow}>
          {categories.map((cat, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.categoryChip, selectedCategory === cat && styles.categoryChipSelected]}
              onPress={() => setSelectedCategory(cat)}
            >
              <View style={[styles.categoryIcon, selectedCategory === cat && styles.categoryIconSelected]}>
                <Text style={[styles.categoryIconText, selectedCategory === cat && styles.categoryIconTextSelected]}>
                  {cat === 'All' ? '★' : cat.charAt(0)}
                </Text>
              </View>
              <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextSelected]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Main Banner */}
        <View style={styles.mainBanner}>
          <View style={styles.bannerBadgeRow}>
            <View style={styles.bannerBadge}>
              <Text style={styles.bannerBadgeText}>NEW</Text>
            </View>
            <View style={styles.bannerBadge}>
              <Text style={styles.bannerBadgeText}>TRENDING</Text>
            </View>
          </View>
          <Text style={styles.bannerTitle}>Fall 2026 Intake Now Open</Text>
          <Text style={styles.bannerText}>Secure your spot at top universities with our expert guidance</Text>
          <TouchableOpacity style={styles.bannerButton} onPress={() => navigation.navigate('ApplicationLock')}>
            <Text style={styles.bannerButtonText}>Start Application</Text>
          </TouchableOpacity>
        </View>

        {/* Popular Destinations */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Destinations</Text>
            <TouchableOpacity><Text style={styles.seeAll}>View All</Text></TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {popularDestinations.map((dest, index) => (
              <TouchableOpacity key={index} style={styles.destinationCard}>
                <Text style={styles.destinationFlag}>{dest.flag === 'uk' ? '🇬🇧' : dest.flag === 'us' ? '🇺🇸' : '🇨🇦'}</Text>
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
            <TouchableOpacity><Text style={styles.seeAll}>View All</Text></TouchableOpacity>
          </View>
          {featuredPrograms.map((program) => (
            <TouchableOpacity
              key={program.id}
              style={[styles.programCard, program.premium && styles.programCardPremium]}
            >
              <View style={styles.programTopRow}>
                <View style={styles.programLevelBadge}>
                  <Text style={styles.programLevelText}>{program.level}</Text>
                </View>
                <View style={[styles.admissionBadge, { backgroundColor: program.admissionColor + '18' }]}>
                  <Text style={[styles.admissionText, { color: program.admissionColor }]}>{program.admission}</Text>
                </View>
              </View>
              <Text style={styles.programTitle}>{program.title}</Text>
              <Text style={styles.programInstitution}>{program.institution}</Text>
              <View style={styles.programFooter}>
                <Text style={styles.programLocation}>{program.location}</Text>
                <Text style={styles.programTuition}>{program.tuition}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Genie Badge Example */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Admission Probability</Text>
          <View style={styles.genieRow}>
            <TouchableOpacity style={styles.genieChip}>
              <View style={[styles.genieDot, { backgroundColor: '#3b82f6' }]} />
              <Text style={styles.genieText}>High Chance (189)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.genieChip}>
              <View style={[styles.genieDot, { backgroundColor: '#cc2936' }]} />
              <Text style={styles.genieText}>Tough Chance (45)</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 55, paddingBottom: 12, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  logoSmall: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#cc2936', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  logoSmallText: { fontSize: 16, fontWeight: 'bold', color: '#ffffff' },
  greeting: { fontSize: 17, fontWeight: '600', color: '#1a1a2e' },
  headerSubtitle: { fontSize: 12, color: '#888888', marginTop: 1 },
  avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#3b82f6', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 16, fontWeight: '600', color: '#ffffff' },
  scrollView: { flex: 1, paddingHorizontal: 20 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, marginTop: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e0e0e0' },
  searchIcon: { fontSize: 16, marginRight: 10 },
  searchInput: { flex: 1, fontSize: 15, color: '#1a1a2e' },
  categoriesRow: { marginBottom: 20 },
  categoryChip: { alignItems: 'center', marginRight: 20, paddingVertical: 4 },
  categoryChipSelected: {},
  categoryIcon: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#f0f4ff', justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  categoryIconSelected: { backgroundColor: '#cc2936' },
  categoryIconText: { fontSize: 20, fontWeight: '600', color: '#3b82f6' },
  categoryIconTextSelected: { color: '#ffffff' },
  categoryText: { fontSize: 12, color: '#666666' },
  categoryTextSelected: { color: '#cc2936', fontWeight: '600' },
  mainBanner: { backgroundColor: '#cc2936', borderRadius: 20, padding: 22, marginBottom: 24, backgroundGradient: 'linear-gradient(135deg, #cc2936, #a01d2b)' },
  bannerBadgeRow: { flexDirection: 'row', marginBottom: 14 },
  bannerBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginRight: 8 },
  bannerBadgeText: { fontSize: 10, fontWeight: '700', color: '#ffffff', letterSpacing: 1 },
  bannerTitle: { fontSize: 20, fontWeight: 'bold', color: '#ffffff', marginBottom: 6 },
  bannerText: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 18, lineHeight: 18 },
  bannerButton: { backgroundColor: '#ffffff', borderRadius: 10, paddingVertical: 11, paddingHorizontal: 22, alignSelf: 'flex-start' },
  bannerButtonText: { fontSize: 14, fontWeight: '700', color: '#cc2936' },
  section: { marginBottom: 26 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#1a1a2e' },
  seeAll: { fontSize: 14, fontWeight: '500', color: '#3b82f6' },
  destinationCard: { backgroundColor: '#f8fafc', borderRadius: 14, padding: 16, marginRight: 12, minWidth: 130, borderWidth: 1, borderColor: '#e0e0e0' },
  destinationFlag: { fontSize: 32, marginBottom: 8 },
  destinationName: { fontSize: 14, fontWeight: '600', color: '#1a1a2e' },
  destinationCount: { fontSize: 11, color: '#888888', marginTop: 4 },
  programCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 18, marginBottom: 14, borderWidth: 1.5, borderColor: '#e0e0e0' },
  programCardPremium: { borderColor: '#3b82f6', borderWidth: 2, shadowColor: '#3b82f6', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 },
  programTopRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  programLevelBadge: { backgroundColor: '#f0f4ff', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  programLevelText: { fontSize: 11, fontWeight: '500', color: '#3b82f6' },
  admissionBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  admissionText: { fontSize: 11, fontWeight: '600' },
  programTitle: { fontSize: 16, fontWeight: '600', color: '#1a1a2e', marginBottom: 4 },
  programInstitution: { fontSize: 13, color: '#666666', marginBottom: 12 },
  programFooter: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingTop: 12 },
  programLocation: { fontSize: 12, color: '#888888' },
  programTuition: { fontSize: 14, fontWeight: '600', color: '#1a1a2e' },
  genieRow: { flexDirection: 'row', marginTop: 4 },
  genieChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 10, marginRight: 12, borderWidth: 1, borderColor: '#e0e0e0' },
  genieDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  genieText: { fontSize: 13, fontWeight: '500', color: '#1a1a2e' },
});

export default HomeScreen;
