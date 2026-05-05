const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// Setup profile
router.post('/setup', authMiddleware, async (req, res) => {
  try {
    const { preferredCountry, courseOfStudy, studyLevel, budgetRange, passportStatus } = req.body;
    
    await User.findByIdAndUpdate(req.userId, {
      profile: { 
        preferredCountry, 
        courseOfStudy, 
        studyLevel, 
        budgetRange, 
        passportStatus 
      },
      profileCompleted: true,
    });
    
    res.json({ 
      success: true, 
      message: 'Profile updated successfully' 
    });
  } catch (error) {
    console.error('Profile setup error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update profile' 
    });
  }
});

// Get profile
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch profile' 
    });
  }
});

module.exports = router;
