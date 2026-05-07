// Simple text-based icon replacement to avoid expo-font issues
import React from 'react';
import { Text } from 'react-native';

const iconMap = {
  'arrow-back': '←',
  'mail-outline': '✉',
  'lock-closed-outline': '🔒',
  'lock-closed': '🔒',
  'eye-outline': '👁',
  'eye-off-outline': '👁‍🗨',
  'person-outline': '👤',
  'call-outline': '📞',
  'checkmark': '✓',
  'checkmark-circle': '✅',
  'checkmark-done': '✓✓',
  'close': '✕',
  'close-circle': '❌',
  'chevron-down': '▼',
  'chevron-forward': '▶',
  'chevron-back': '◀',
  'search-outline': '🔍',
  'search': '🔍',
  'notifications-outline': '🔔',
  'home-outline': '🏠',
  'home': '🏠',
  'document-text-outline': '📄',
  'document-text': '📄',
  'document-outline': '📃',
  'chatbubble-outline': '💬',
  'chatbubble': '💬',
  'chatbubbles-outline': '💬',
  'send': '➤',
  'add-circle-outline': '➕',
  'add-circle': '➕',
  'add': '➕',
  'trash-outline': '🗑',
  'cloud-upload-outline': '☁',
  'star-outline': '☆',
  'star': '⭐',
  'settings-outline': '⚙',
  'settings': '⚙',
  'information-circle-outline': 'ℹ',
  'information-circle': 'ℹ',
  'alert-circle': '⚠',
  'time-outline': '⏱',
  'cash-outline': '💰',
  'card-outline': '💳',
  'phone-portrait-outline': '📱',
  'headset-outline': '🎧',
  'shield-checkmark': '🛡',
  'refresh': '🔄',
  'trending-up': '📈',
  'airplane-outline': '✈',
  'airplane': '✈',
  'business-outline': '🏢',
  'school-outline': '🎓',
  'library-outline': '📚',
  'briefcase-outline': '💼',
  'camera-outline': '📷',
  'id-card-outline': '🪪',
  'trophy': '🏆',
  'open-outline': '🔗',
  'logo-whatsapp': '',
  'logo-google': 'G',
};

export default function Icon({ name, size = 20, color = '#000', style }) {
  const symbol = iconMap[name] || '•';
  return (
    <Text style={[{ fontSize: size, color }, style]}>
      {symbol}
    </Text>
  );
}
