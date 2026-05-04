// backend/models/Application.js
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  applicationId: { type: String, unique: true },
  
  // Personal Info
  firstName: String,
  lastName: String,
  dateOfBirth: String,
  gender: String,
  nationality: String,
  address: String,
  city: String,
  emergencyContact: String,
  emergencyPhone: String,
  
  // Study Plan
  preferredCountries: [String],
  preferredCourses: [String],
  intendedStartDate: String,
  studyLevel: String,
  budgetRange: String,
  
  // Education
  highestQualification: String,
  institutionName: String,
  yearOfGraduation: String,
  grade: String,
  englishProficiency: String,
  englishScore: String,
  
  // Work Experience
  hasWorkExperience: Boolean,
  workExperience: [{
    company: String,
    position: String,
    startDate: String,
    endDate: String,
    description: String,
  }],
  skills: [String],
  
  // Status
  status: {
    type: String,
    enum: ['registered', 'docs_submitted', 'under_review', 'applied', 'admission_received', 'visa_processing'],
    default: 'registered',
  },
  statusHistory: [{
    status: String,
    notes: String,
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now },
  }],
  
  // Documents Ready
  documentsReady: {
    passport: Boolean,
    certificates: Boolean,
    transcript: Boolean,
    cv: Boolean,
    photo: Boolean,
  },
  
  offerLetter: String,
  
  submittedAt: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Generate application ID before save
applicationSchema.pre('save', async function(next) {
  if (!this.applicationId) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Application').countDocuments();
    this.applicationId = `GISC-${year}-${String(count + 1).padStart(4, '0')}`;
  }
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Application', applicationSchema);
