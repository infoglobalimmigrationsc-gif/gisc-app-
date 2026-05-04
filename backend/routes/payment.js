const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// Initiate payment
router.post('/initiate', authMiddleware, async (req, res) => {
  try {
    const { amount, type, paymentMethod } = req.body;
    
    // Generate transaction ID
    const transactionId = `GISC-${Date.now()}-${req.userId.slice(-6).toUpperCase()}`;
    
    // Create payment record
    const payment = new Payment({
      userId: req.userId,
      transactionId,
      amount,
      type,
      paymentMethod,
      status: 'pending',
      paymentDetails: {
        provider: paymentMethod === 'mobile_money' ? 'Lonestar MTN' : 'Card',
      },
    });
    
    await payment.save();
    
    res.json({
      success: true,
      transactionId,
      paymentId: payment._id,
      message: 'Payment initiated',
    });
  } catch (error) {
    console.error('Payment initiation error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to initiate payment' 
    });
  }
});

// Process mobile money payment
router.post('/process-mobile', authMiddleware, async (req, res) => {
  try {
    const { transactionId, phoneNumber, amount } = req.body;
    
    // Find payment
    const payment = await Payment.findOne({ transactionId, userId: req.userId });
    
    if (!payment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Payment not found' 
      });
    }
    
    // Update payment with phone number
    payment.paymentDetails.phoneNumber = phoneNumber;
    payment.status = 'processing';
    await payment.save();
    
    // In production, integrate with actual Mobile Money API
    // This is where you'd call Lonestar MTN's API
    
    res.json({
      success: true,
      message: 'Payment processing. Please check your phone for authorization prompt.',
      transactionId,
    });
  } catch (error) {
    console.error('Mobile payment error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Payment processing failed' 
    });
  }
});

// Check payment status
router.get('/status/:transactionId', authMiddleware, async (req, res) => {
  try {
    const payment = await Payment.findOne({ 
      transactionId: req.params.transactionId,
      userId: req.userId,
    });
    
    if (!payment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Payment not found' 
      });
    }
    
    // In production, check actual status from payment provider
    
    res.json({
      success: true,
      status: payment.status,
      transactionId: payment.transactionId,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to check payment status' 
    });
  }
});

// Verify payment (webhook endpoint)
router.post('/verify', authMiddleware, async (req, res) => {
  try {
    const { transactionId, status } = req.body;
    
    const payment = await Payment.findOne({ transactionId });
    
    if (!payment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Payment not found' 
      });
    }
    
    if (status === 'successful' || status === 'completed') {
      payment.status = 'completed';
      payment.completedAt = new Date();
      await payment.save();
      
      // Unlock application for user
      await User.findByIdAndUpdate(payment.userId, {
        applicationUnlocked: true,
      });
      
      res.json({ 
        success: true, 
        message: 'Payment verified. Application unlocked!' 
      });
    } else {
      payment.status = 'failed';
      await payment.save();
      
      res.json({ 
        success: false, 
        message: 'Payment failed or was declined.' 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Verification failed' 
    });
  }
});

// Get payment history
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.userId })
      .sort({ createdAt: -1 });
    
    res.json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch payment history' 
    });
  }
});

module.exports = router;
