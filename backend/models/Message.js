// backend/models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sender: { type: String, enum: ['user', 'counselor', 'system'], required: true },
  content: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['sending', 'sent', 'delivered', 'read', 'failed'], 
    default: 'sent' 
  },
  attachments: [{
    type: { type: String },
    url: String,
    name: String,
  }],
  timestamp: { type: Date, default: Date.now },
  readAt: Date,
});

module.exports = mongoose.model('Message', messageSchema);
