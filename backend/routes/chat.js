// backend/routes/chat.js
const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// Get messages
router.get('/messages', authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { userId: req.userId },
        { recipientId: req.userId },
      ],
    }).sort({ timestamp: 1 }).limit(100);
    
    const formattedMessages = messages.map(msg => ({
      id: msg._id,
      text: msg.content,
      sender: msg.sender === 'user' ? 'user' : 'counselor',
      timestamp: msg.timestamp,
      status: msg.status,
    }));
    
    res.json({ success: true, messages: formattedMessages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Send message
router.post('/send', authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;
    
    const newMessage = new Message({
      userId: req.userId,
      sender: 'user',
      content: message,
      timestamp: new Date(),
      status: 'sent',
    });
    
    await newMessage.save();
    
    // Auto-reply (can be replaced with actual counselor reply)
    setTimeout(async () => {
      const autoReply = new Message({
        userId: req.userId,
        sender: 'counselor',
        content: 'Thank you for your message. A counselor will respond shortly. In the meantime, you can check your application tracker for updates.',
        timestamp: new Date(),
        status: 'delivered',
      });
      await autoReply.save();
    }, 2000);
    
    res.json({ 
      success: true, 
      message: {
        id: newMessage._id,
        text: newMessage.content,
        sender: 'user',
        timestamp: newMessage.timestamp,
        status: 'sent',
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get counselor info
router.get('/counselor/info', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    // Get assigned counselor based on user's preferred country
    const counselor = {
      name: 'Damilola Folulana',
      title: 'Senior Education Counselor',
      studentsHelped: 150,
      specialization: user.profile?.preferredCountry || 'USA/Canada',
      avatar: null,
    };
    
    res.json({ success: true, counselor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
