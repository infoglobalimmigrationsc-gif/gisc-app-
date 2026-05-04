// backend/models/Document.js
const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: ['passport', 'certificates', 'transcript', 'cv', 'photo'], 
    required: true 
  },
  name: String,
  url: { type: String, required: true },
  size: Number,
  mimeType: String,
  uploadedAt: { type: Date, default: Date.now },
  verified: { type: Boolean, default: false },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  verifiedAt: Date,
});

module.exports = mongoose.model('Document', documentSchema);
