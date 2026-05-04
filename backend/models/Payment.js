// backend/models/Payment.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application' },
  transactionId: { type: String, unique: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  type: { 
    type: String, 
    enum: ['application_fee', 'processing_fee', 'premium_package'], 
    required: true 
  },
  paymentMethod: { type: String, enum: ['mobile_money', 'card', 'bank_transfer'] },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded'], 
    default: 'pending' 
  },
  paymentDetails: {
    phoneNumber: String,
    provider: String,
    cardLast4: String,
  },
  createdAt: { type: Date, default: Date.now },
  completedAt: Date,
});

module.exports = mongoose.model('Payment', paymentSchema);
