// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  userType: { type: String, enum: ['student', 'admin', 'counselor'], default: 'student' },
  profileCompleted: { type: Boolean, default: false },
  applicationUnlocked: { type: Boolean, default: false },
  applicationStatus: {
    type: String,
    enum: ['registered', 'docs_submitted', 'under_review', 'applied', 'admission_received', 'visa_processing'],
    default: 'registered',
  },
  profile: {
    preferredCountry: String,
    courseOfStudy: String,
    studyLevel: String,
    budgetRange: String,
    passportStatus: String,
  },
  documents: {
    passport: String,
    certificates: [String],
    transcript: String,
    cv: String,
    photo: String,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
