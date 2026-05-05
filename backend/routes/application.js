// backend/routes/application.js
const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// Get all applications for a user
router.get('/list', authMiddleware, async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.userId });
    
    const active = applications.filter(app => 
      ['registered', 'docs_submitted', 'under_review', 'applied', 'visa_processing'].includes(app.status)
    );
    
    const inactive = applications.filter(app => 
      ['admission_received', 'rejected', 'withdrawn'].includes(app.status)
    );
    
    res.json({ 
      success: true, 
      active,
      inactive 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch applications' 
    });
  }
});

// Check if user has unlocked application access
router.get('/check-access', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json({ 
      success: true, 
      hasAccess: user.applicationUnlocked 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Submit application
router.post('/submit', authMiddleware, async (req, res) => {
  try {
    const applicationData = req.body;
    
    const application = new Application({
      userId: req.userId,
      ...applicationData,
      status: 'registered',
      submittedAt: new Date(),
    });
    
    await application.save();
    
    await User.findByIdAndUpdate(req.userId, {
      applicationStatus: 'registered',
    });
    
    res.json({ 
      success: true, 
      applicationId: application._id,
      message: 'Application submitted successfully' 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get application status
router.get('/status', authMiddleware, async (req, res) => {
  try {
    const application = await Application.findOne({ userId: req.userId });
    
    if (!application) {
      return res.json({ 
        success: true, 
        application: null,
        status: 'not_started' 
      });
    }
    
    const timeline = application.statusHistory || [];
    
    res.json({ 
      success: true, 
      application,
      timeline,
      status: application.status 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update application status (Admin only)
router.put('/status/:id', authMiddleware, async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    
    application.statusHistory.push({
      status,
      notes,
      updatedBy: req.userId,
      timestamp: new Date(),
    });
    
    application.status = status;
    await application.save();
    
    await User.findByIdAndUpdate(application.userId, {
      applicationStatus: status,
    });
    
    res.json({ success: true, message: 'Status updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
