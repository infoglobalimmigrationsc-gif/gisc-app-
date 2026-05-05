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
import api from '../../services/api';

const ChatScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [counselor, setCounselor] = useState({
    name: 'Faith Isikwei',
    title: 'Senior Counsellor',
    studentsHelped: 150,
  });
  const flatListRef = useRef(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      await loadCounselorInfo();
    } catch (error) {
      // Use default counselor info
    }
    
    try {
      await loadMessages();
    } catch (error) {
      // Start with empty messages
    }
    
    setLoading(false);
    setDataLoaded(true);
  };

  const loadCounselorInfo = async () => {
    try {
      const response = await api.get('/counselor/info');
      if (response.data?.success && response.data.counselor) {
        setCounselor(response.data.counselor);
      }
    } catch (error) {
      // Silently use default counselor
    }
  };

  const loadMessages = async () => {
    try {
      const response = await api.get('/chat/messages');
      if (response.data?.success && response.data.messages) {
        setMessages(response.data.messages);
      }
    } catch (error) {
      // Silently use empty messages array
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const tempMessage = {
      id: `temp_${Date.now()}`,
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date().toISOString(),
      status: 'sending',
    };

    setMessages(prev => [...prev, tempMessage]);
    setInputText('');
    setSending(true);

    try {
      const response = await api.post('/chat/send', { message: inputText.trim() });

      if (response.data?.success) {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === tempMessage.id 
              ? { ...response.data.message, status: 'sent' }
              : msg
          )
        );
      }
    } catch (error) {
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
    const phoneNumber = '+231880123456';
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
                {counselor?.name?.charAt(0) || 'F'}
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
              {item.timestamp ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
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
            {counselor?.name?.charAt(0) || 'F'}
          </Text>
        </View>
        <View style={styles.counselorInfo}>
          <Text style={styles.counselorName}>
            {counselor?.name || 'Faith Isikwei'}
          </Text>
          <Text style={styles.counselorTitle}>
            {counselor?.title || 'Senior Counsellor'}
          </Text>
          <Text style={styles.counselorStats}>
            🎓 Counseled {counselor?.studentsHelped || '150'}+ students in 4+ years
          </Text>
        </View>
      </View>

      <View style={styles.welcomeMessage}>
        <Text style={styles.welcomeText}>
          👋 Hey there! I'm {counselor?.name?.split(' ')[0] || 'Faith'}, your dedicated counselor. 
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
            <Text style={styles.quickActionIcon}>📄</Text>
            <Text style={styles.quickActionText}>Application Help</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => setInputText('What are the visa requirements?')}
          >
            <Text style={styles.quickActionIcon}>✈️</Text>
            <Text style={styles.quickActionText}>Visa Questions</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => setInputText('Tell me about scholarships')}
          >
            <Text style={styles.quickActionIcon}>💰</Text>
            <Text style={styles.quickActionText}>Scholarships</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={openWhatsApp}
          >
            <Text style={styles.quickActionIcon}>💬</Text>
            <Text style={[styles.quickActionText, { color: '#25D366' }]}>WhatsApp</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#cc2936" />
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
        <View style={{ width: 40 }} />
        <Text style={styles.headerTitle}>Support Chat</Text>
        <TouchableOpacity onPress={openWhatsApp}>
          <Text style={styles.whatsappIcon}>💬</Text>
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
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {/* Input Bar */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Write a message"
          placeholderTextColor="#999999"
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
            <Text style={styles.sendIcon}>➤</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* WhatsApp Banner */}
      <TouchableOpacity style={styles.whatsappBanner} onPress={openWhatsApp}>
        <Text style={styles.whatsappBannerIcon}>💬</Text>
        <Text style={styles.whatsappBannerText}>
          Prefer WhatsApp? Click to chat with us directly
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#888888',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#ffffff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a3a5c',
  },
  whatsappIcon: {
    fontSize: 24,
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
    backgroundColor: '#1a3a5c',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  counselorAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#c0c0c0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  counselorAvatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a3a5c',
  },
  counselorInfo: {
    flex: 1,
  },
  counselorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 2,
  },
  counselorTitle: {
    fontSize: 13,
    color: '#c0c0c0',
    marginBottom: 4,
  },
  counselorStats: {
    fontSize: 12,
    color: '#c0c0c0',
  },
  welcomeMessage: {
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 14,
    color: '#1a3a5c',
    lineHeight: 20,
    marginBottom: 8,
  },
  welcomeSubtext: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a3a5c',
  },
  quickActions: {
    marginBottom: 16,
  },
  quickActionsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#888888',
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
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    margin: 4,
  },
  quickActionIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  quickActionText: {
    fontSize: 13,
    color: '#1a3a5c',
    fontWeight: '500',
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
    backgroundColor: '#1a3a5c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  messageBubble: {
    maxWidth: '75%',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  userBubble: {
    backgroundColor: '#cc2936',
    borderBottomRightRadius: 4,
  },
  counselorBubble: {
    backgroundColor: '#f5f5f5',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#ffffff',
  },
  counselorMessageText: {
    color: '#1a3a5c',
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 4,
  },
  messageTime: {
    fontSize: 10,
    color: '#c0c0c0',
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
    borderTopColor: '#f0f0f0',
    backgroundColor: '#ffffff',
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 15,
    color: '#1a3a5c',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#cc2936',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  sendButtonDisabled: {
    backgroundColor: '#c0c0c0',
  },
  sendIcon: {
    fontSize: 18,
    color: '#ffffff',
  },
  whatsappBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  whatsappBannerIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  whatsappBannerText: {
    fontSize: 13,
    color: '#888888',
  },
});

export default ChatScreen;
