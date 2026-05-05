// frontend/src/screens/chat/MeetingsScreen.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';

const TIME_SLOTS = [
  ['08:00 AM', '08:30 AM', '09:00 AM'],
  ['09:30 AM', '10:30 AM', '11:00 AM'],
  ['11:30 AM', '12:00 PM', '01:00 PM'],
  ['01:30 PM', '02:00 PM', '02:30 PM'],
  ['03:00 PM', '03:30 PM', '04:00 PM'],
];

const MeetingsScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showBooking, setShowBooking] = useState(false);
  const [selectedDate, setSelectedDate] = useState('05 May 2026');
  const [selectedTime, setSelectedTime] = useState(null);

  const handleBookSession = () => {
    if (!selectedTime) {
      Alert.alert('Select Time', 'Please select a time slot.');
      return;
    }
    
    Alert.alert(
      'Session Booked! 🎉',
      `Your session is scheduled for ${selectedDate} at ${selectedTime}. You will receive a confirmation email shortly.`,
      [
        { text: 'OK', onPress: () => setShowBooking(false) }
      ]
    );
  };

  if (showBooking) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setShowBooking(false)}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Book a session</Text>
          <View style={{ width: 50 }} />
        </View>

        <ScrollView style={styles.bookingContent}>
          <Text style={styles.bookingLabel}>Date</Text>
          <TouchableOpacity style={styles.dateButton}>
            <Text style={styles.dateText}>{selectedDate}</Text>
            <Text style={styles.dateIcon}>📅</Text>
          </TouchableOpacity>

          <Text style={styles.bookingLabel}>Time [GMT]</Text>
          <View style={styles.timeGrid}>
            {TIME_SLOTS.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.timeRow}>
                {row.map((time) => (
                  <TouchableOpacity
                    key={time}
                    style={[
                      styles.timeSlot,
                      selectedTime === time && styles.timeSlotSelected,
                    ]}
                    onPress={() => setSelectedTime(time)}
                  >
                    <Text style={[
                      styles.timeSlotText,
                      selectedTime === time && styles.timeSlotTextSelected,
                    ]}>
                      {time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>

          <View style={styles.bookingButtons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowBooking(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleBookSession}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meetings</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.tabActive]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.tabTextActive]}>
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.tabActive]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}>
            History
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentCenter}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📅</Text>
          <Text style={styles.emptyTitle}>Got questions? We've got the answers!</Text>
          <Text style={styles.emptySubtitle}>
            Book a 1:1 video meet-up with your dedicated counsellor. 
            They're here to guide you every step of the way!
          </Text>
          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => setShowBooking(true)}
          >
            <Text style={styles.bookButtonText}>Book session now</Text>
          </TouchableOpacity>
        </View>
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backText: {
    fontSize: 16,
    color: '#1a3a5c',
    width: 50,
  },
  headerTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a3a5c',
    textAlign: 'center',
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#e0e0e0',
  },
  tabActive: {
    borderBottomColor: '#1a3a5c',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#888888',
  },
  tabTextActive: {
    color: '#1a3a5c',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  contentCenter: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a3a5c',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
  },
  bookButton: {
    backgroundColor: '#cc2936',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 40,
    shadowColor: '#cc2936',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  bookButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  bookingContent: {
    paddingHorizontal: 20,
  },
  bookingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a3a5c',
    marginBottom: 12,
    marginTop: 20,
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dateText: {
    fontSize: 16,
    color: '#1a3a5c',
    fontWeight: '500',
  },
  dateIcon: {
    fontSize: 20,
  },
  timeGrid: {
    marginBottom: 30,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  timeSlot: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingVertical: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  timeSlotSelected: {
    backgroundColor: '#1a3a5c',
    borderColor: '#1a3a5c',
  },
  timeSlotText: {
    fontSize: 13,
    color: '#666666',
    fontWeight: '500',
  },
  timeSlotTextSelected: {
    color: '#ffffff',
  },
  bookingButtons: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#888888',
    fontWeight: '500',
  },
  continueButton: {
    flex: 2,
    backgroundColor: '#cc2936',
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 12,
  },
  continueButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
});

export default MeetingsScreen;
