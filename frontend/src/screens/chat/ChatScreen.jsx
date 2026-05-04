// frontend/src/screens/chat/ChatScreen.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'https://api.gisc-liberia.com/api';

const ChatScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [counselor, setCounselor] = useState(null);
  const flatListRef = useRef(null);

  useEffect(() => {
    loadCounselorInfo();
    loadMessages();
  }, []);

  const loadCounselorInfo = async () => {
    try {
      const token = await AsyncStorage.getItem('gisc_token');
      const response = await axios.get(`${API_URL}/counselor/info`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setCounselor(response.data.counselor);
      }
    } catch (error) {
      console.error('Error loading counselor:', error);
    }
  };

  const loadMessages = async () => {
    try {
      const token = await AsyncStorage.getItem('gisc_token');
      const response = await axios.get(`${API_URL}/chat/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setMessages(response.data.messages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const tempMessage = {
      id: `temp_${Date.now()}`,
      text: inputText,
      sender: 'user',
      timestamp: new Date().toISOString(),
      status: 'sending',
    };

    setMessages(prev => [...prev, tempMessage]);
    setInputText('');
    setSending(true);

    try {
      const token = await AsyncStorage.getItem('gisc_token');
      const response = await axios.post(
        `${API_URL}/chat/send`,
        { message: inputText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        // Update temp message with server response
        setMessages(prev => 
          prev.map(msg => 
            msg.id === tempMessage.id 
              ? { ...response.data.message, status: 'sent' }
              : msg
          )
        );
      }
    } catch (error) {
      // Mark message as failed
      setMessages(prev => 
        prev.map(msg => 
          msg.id === tempMessage.id 
            ? { ...msg, status: 'failed' }
            : msg
        )
      );
    } finally {
      setSending(false);
    }
  };

  const openWhatsApp = () => {
    const phoneNumber = '+231880123456'; // GISC WhatsApp number
    const message = encodeURIComponent('Hello GISC, I need assistance with my study abroad application.');
    Linking.openURL(`whatsapp://send?phone=${phoneNumber}&text=${message}`)
      .catch(() => {
        Alert.alert(
          'WhatsApp Not Installed',
          'Would you like to contact us via web WhatsApp?',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Open Web', 
              onPress: () => Linking.openURL(`https://wa.me/${phoneNumber}?text=${message}`)
            },
          ]
        );
      });
  };

  const renderMessage = ({ item }) => {
    const isUser = item.sender === 'user';

    return (
      <View style={[styles.messageContainer, isUser ? styles.userMessage : styles.counselorMessage]}>
        {!isUser && (
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {counselor?.name?.charAt(0) || 'C'}
              </Text>
            </View>
          </View>
        )}
        
        <View style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.counselorBubble,
        ]}>
          <Text style={[
            styles.messageText,
            isUser ? styles.userMessageText : styles.counselorMessageText,
          ]}>
            {item.text}
          </Text>
          <View style={styles.messageFooter}>
            <Text style={styles.messageTime}>
              {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
            {isUser && (
              <Ionicons 
                name={
                  item.status === 'sending' ? 'time-outline' :
                  item.status === 'sent' ? 'checkmark' :
                  item.status === 'delivered' ? 'checkmark-done' :
                  item.status === 'failed' ? 'alert-circle' : 'checkmark'
                }
                size={14} 
                color={item.status === 'failed' ? '#E74C3C' : '#8AA0B8'}
                style={styles.messageStatus}
              />
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.headerInfo}>
      <View style={styles.counselorCard}>
        <View style={styles.counselorAvatar}>
          <Text style={styles.counselorAvatarText}>
            {counselor?.name?.charAt(0) || 'D'}
          </Text>
        </View>
        <View style={styles.counselorInfo}>
          <Text style={styles.counselorName}>
            {counselor?.name || 'Damilola Folulana'}
          </Text>
          <Text style={styles.counselorTitle}>Your Dedicated Counselor</Text>
          <Text style={styles.counselorStats}>
            🎓 Counseled {counselor?.studentsHelped || '150'}+ students in 4+ years
          </Text>
        </View>
      </View>

      <View style={styles.welcomeMessage}>
        <Text style={styles.welcomeText}>
          👋 Hey there! I'm {counselor?.name?.split(' ')[0] || 'Damilola'}, your dedicated counselor. 
          I've counseled over {counselor?.studentsHelped || '150'} students in the last 4 years, 
          and I'm excited to support you through your entire study-abroad journey.
        </Text>
        <Text style={styles.welcomeSubtext}>
          Let's get started! What can I help you with today?
        </Text>
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.quickActionsTitle}>Quick Actions</Text>
        <View style={styles.quickActionButtons}>
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => setInputText('I need help with my application')}
          >
            <Ionicons name="document-text-outline" size={20} color="#1E3A5F" />
            <Text style={styles.quickActionText}>Application Help</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => setInputText('What are the visa requirements?')}
          >
            <Ionicons name="airplane-outline" size={20} color="#1E3A5F" />
            <Text style={styles.quickActionText}>Visa Questions</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => setInputText('Tell me about scholarships')}
          >
            <Ionicons name="cash-outline" size={20} color="#1E3A5F" />
            <Text style={styles.quickActionText}>Scholarships</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={openWhatsApp}
          >
            <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
            <Text style={[styles.quickActionText, { color: '#25D366' }]}>WhatsApp</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E3A5F" />
        <Text style={styles.loadingText}>Loading conversation...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1E3A5F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Support Chat</Text>
        <TouchableOpacity onPress={openWhatsApp}>
          <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      {/* Input Bar */}
      <View style={styles.inputContainer}>
        <TouchableOpacity 
          style={styles.attachButton}
          onPress={() => Alert.alert('Coming Soon', 'File attachment will be available soon!')}
        >
          <Ionicons name="add-circle-outline" size={26} color="#1E3A5F" />
        </TouchableOpacity>
        
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          placeholderTextColor="#8AA0B8"
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
        />
        
        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!inputText.trim() || sending}
        >
          {sending ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Ionicons name="send" size={20} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>

      {/* WhatsApp Banner */}
      <TouchableOpacity style={styles.whatsappBanner} onPress={openWhatsApp}>
        <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
        <Text style={styles.whatsappBannerText}>
          Prefer WhatsApp? Click to chat with us directly
        </Text>
        <Ionicons name="open-outline" size={16} color="#8AA0B8" />
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#5A7D9C',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EEF5',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E3A5F',
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerInfo: {
    marginBottom: 20,
  },
  counselorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E3A5F',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  counselorAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#A8D0E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  counselorAvatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E3A5F',
  },
  counselorInfo: {
    flex: 1,
  },
  counselorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  counselorTitle: {
    fontSize: 13,
    color: '#A8D0E6',
    marginBottom: 4,
  },
  counselorStats: {
    fontSize: 12,
    color: '#A8D0E6',
  },
  welcomeMessage: {
    backgroundColor: '#F5F9FF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 14,
    color: '#1E3A5F',
    lineHeight: 20,
    marginBottom: 8,
  },
  welcomeSubtext: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E3A5F',
  },
  quickActions: {
    marginBottom: 16,
  },
  quickActionsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#5A7D9C',
    marginBottom: 12,
  },
  quickActionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFCFE',
    borderWidth: 1,
    borderColor: '#E8EEF5',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    margin: 4,
  },
  quickActionText: {
    fontSize: 13,
    color: '#1E3A5F',
    marginLeft: 8,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  counselorMessage: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    marginRight: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E3A5F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  messageBubble: {
    maxWidth: '75%',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  userBubble: {
    backgroundColor: '#1E3A5F',
    borderBottomRightRadius: 4,
  },
  counselorBubble: {
    backgroundColor: '#F5F9FF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E8EEF5',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  counselorMessageText: {
    color: '#1E3A5F',
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 4,
  },
  messageTime: {
    fontSize: 10,
    color: '#8AA0B8',
    marginRight: 4,
  },
  messageStatus: {
    marginLeft: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E8EEF5',
    backgroundColor: '#FFFFFF',
  },
  attachButton: {
    marginRight: 12,
    paddingBottom: 4,
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F9FF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 15,
    color: '#1E3A5F',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E3A5F',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  sendButtonDisabled: {
    backgroundColor: '#8AA0B8',
  },
  whatsappBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#F5F9FF',
    borderTopWidth: 1,
    borderTopColor: '#E8EEF5',
  },
  whatsappBannerText: {
    fontSize: 13,
    color: '#5A7D9C',
    marginLeft: 8,
    marginRight: 4,
  },
});

export default ChatScreen;
