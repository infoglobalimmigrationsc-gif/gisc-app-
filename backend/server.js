// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User Schema
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  profileCompleted: { type: Boolean, default: false },
  profile: {
    preferredCountry: String,
    courseOfStudy: String,
    studyLevel: String,
    budgetRange: String,
    passportStatus: String,
  },
  applicationUnlocked: { type: Boolean, default: false },
  applicationStatus: {
    type: String,
    enum: ['registered', 'docs_submitted', 'under_review', 'applied', 'admission_received', 'visa_processing'],
    default: 'registered',
  },
  payments: [{
    amount: Number,
    type: String,
    transactionId: String,
    status: String,
    date: { type: Date, default: Date.now },
  }],
  documents: {
    passport: String,
    certificates: [String],
    transcript: String,
    cv: String,
    photo: String,
  },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      fullName,
      email,
      phone,
      password: hashedPassword,
    });
    
    await user.save();
    
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        profileCompleted: user.profileCompleted,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        profileCompleted: user.profileCompleted,
        applicationUnlocked: user.applicationUnlocked,
        applicationStatus: user.applicationStatus,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Auth Middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// Profile Routes
app.post('/api/profile/setup', authMiddleware, async (req, res) => {
  try {
    const { preferredCountry, courseOfStudy, studyLevel, budgetRange, passportStatus } = req.body;
    
    await User.findByIdAndUpdate(req.userId, {
      profile: { preferredCountry, courseOfStudy, studyLevel, budgetRange, passportStatus },
      profileCompleted: true,
    });
    
    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Payment Routes
app.post('/api/payment/initiate', authMiddleware, async (req, res) => {
  try {
    const { amount, type, paymentMethod } = req.body;
    
    // Integrate with Flutterwave or Mobile Money API here
    // This is a placeholder for the actual payment gateway integration
    
    const transactionId = `GISC-${Date.now()}-${req.userId.slice(-6)}`;
    
    res.json({
      success: true,
      transactionId,
      paymentLink: `https://checkout.flutterwave.com/v3/hosted/pay/${transactionId}`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/payment/verify', authMiddleware, async (req, res) => {
  try {
    const { transactionId, status } = req.body;
    
    if (status === 'successful') {
      await User.findByIdAndUpdate(req.userId, {
        applicationUnlocked: true,
        $push: {
          payments: {
            amount: 10,
            type: 'application_fee',
            transactionId,
            status: 'completed',
          },
        },
      });
      
      res.json({ success: true, message: 'Payment verified, application unlocked' });
    } else {
      res.json({ success: false, message: 'Payment not successful' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`GISC Backend running on port ${PORT}`);
});
