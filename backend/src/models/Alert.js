const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coinId: {
    type: String,
    required: true
  },
  coinSymbol: {
    type: String,
    required: true,
    uppercase: true
  },
  coinName: {
    type: String,
    required: true
  },
  alertPrice: {
    type: Number,
    required: true
  },
  condition: {
    type: String,
    enum: ['above', 'below'],
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  triggered: {
    type: Boolean,
    default: false
  },
  triggeredAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Alert', AlertSchema);