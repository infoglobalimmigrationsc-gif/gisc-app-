// backend/routes/admin.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Application = require('../models/Application');
const Payment = require('../models/Payment');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');

// Get dashboard stats
router.get('/stats', [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ userType: 'student' });
    const totalApplications = await Application.countDocuments();
    const totalPayments = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    
    const applicationsByStatus = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    
    const recentUsers = await User.find({ userType: 'student' })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('-password');
    
    res.json({
      success: true,
      stats: {
        totalUsers,
        totalApplications,
        totalRevenue: totalPayments[0]?.total || 0,
        applicationsByStatus,
        recentUsers,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all users
router.get('/users', [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const { page = 1, limit = 20, search, country, status } = req.query;
    
    const query = { userType: 'student' };
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    if (country) {
      query['profile.preferredCountry'] = country;
    }
    
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-password');
    
    const total = await User.countDocuments(query);
    
    res.json({
      success: true,
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get user details
router.get('/users/:id', [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    const applications = await Application.find({ userId: req.params.id });
    const payments = await Payment.find({ userId: req.params.id });
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({
      success: true,
      user,
      applications,
      payments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update application status (Admin)
router.put('/applications/:id/status', [authMiddleware, adminMiddleware], async (req, res) => {
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
    
    // Update user
    await User.findByIdAndUpdate(application.userId, { applicationStatus: status });
    
    res.json({ success: true, message: 'Status updated', application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all payments
router.get('/payments', [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('userId', 'fullName email')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Send message to user
router.post('/messages/send', [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const { userId, message } = req.body;
    
    const newMessage = new Message({
      userId,
      sender: 'counselor',
      content: message,
      timestamp: new Date(),
      status: 'delivered',
    });
    
    await newMessage.save();
    
    res.json({ success: true, message: 'Message sent' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
