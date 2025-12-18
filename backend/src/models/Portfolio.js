const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coinId: {
    type: String,
    required: [true, 'Please provide coin ID']
  },
  symbol: {
    type: String,
    required: [true, 'Please provide coin symbol'],
    uppercase: true
  },
  name: {
    type: String,
    required: [true, 'Please provide coin name']
  },
  amount: {
    type: Number,
    required: [true, 'Please provide amount'],
    min: [0.00000001, 'Amount must be greater than 0']
  },
  buyPrice: {
    type: Number,
    required: [true, 'Please provide buy price'],
    min: [0, 'Buy price must be positive']
  },
  buyDate: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  tags: [{
    type: String
  }],
  // Auto-calculated fields
  currentPrice: {
    type: Number,
    default: 0
  },
  value: {
    type: Number,
    default: 0
  },
  profitLoss: {
    type: Number,
    default: 0
  },
  profitLossPercentage: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index for user and coin combination
PortfolioSchema.index({ userId: 1, coinId: 1 }, { unique: true });

module.exports = mongoose.model('Portfolio', PortfolioSchema);