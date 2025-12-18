const Portfolio = require('../models/Portfolio');
const coingeckoService = require('../services/coingeckoService');
const { calculatePortfolioSummary } = require('../utils/calculatePortfolio');

// @desc    Get user portfolio
// @route   GET /api/portfolio
// @access  Private
const getPortfolio = async (req, res) => {
  try {
    const holdings = await Portfolio.find({ userId: req.user._id });

    // Get current prices for all coins
    const coinIds = [...new Set(holdings.map(h => h.coinId))];
    const prices = await coingeckoService.getPrices(coinIds);

    // Update holdings with current prices
    const updatedHoldings = await Promise.all(
      holdings.map(async (holding) => {
        const currentPrice = prices[holding.coinId]?.usd || 0;

        holding.currentPrice = currentPrice;
        holding.value = holding.amount * currentPrice;
        holding.profitLoss = holding.value - (holding.amount * holding.buyPrice);
        holding.profitLossPercentage = holding.buyPrice > 0
          ? (holding.profitLoss / (holding.amount * holding.buyPrice)) * 100
          : 0;
        holding.lastUpdated = new Date();

        await holding.save();
        return holding;
      })
    );

    // Calculate portfolio summary
    const summary = calculatePortfolioSummary(updatedHoldings);

    res.json(summary);
  } catch (error) {
    console.error('Get portfolio error:', error);
    res.status(500).json({ message: 'Failed to fetch portfolio' });
  }
};

// @desc    Add holding to portfolio
// @route   POST /api/portfolio
// @access  Private
const addHolding = async (req, res) => {
  try {
    const { coinId, symbol, name, amount, buyPrice, buyDate, notes, tags } = req.body;

    // Check if holding already exists
    const existingHolding = await Portfolio.findOne({
      userId: req.user._id,
      coinId
    });

    if (existingHolding) {
      return res.status(400).json({
        message: 'Holding for this coin already exists. Please update instead.'
      });
    }

    // Get current price
    const prices = await coingeckoService.getPrices([coinId]);
    const currentPrice = prices[coinId]?.usd || buyPrice;

    // Create holding
    const holding = await Portfolio.create({
      userId: req.user._id,
      coinId,
      symbol: symbol.toUpperCase(),
      name,
      amount: parseFloat(amount),
      buyPrice: parseFloat(buyPrice),
      buyDate: buyDate || new Date(),
      notes,
      tags,
      currentPrice,
      value: parseFloat(amount) * currentPrice,
      profitLoss: (parseFloat(amount) * currentPrice) - (parseFloat(amount) * parseFloat(buyPrice)),
      profitLossPercentage: parseFloat(buyPrice) > 0
        ? ((currentPrice - parseFloat(buyPrice)) / parseFloat(buyPrice)) * 100
        : 0
    });

    res.status(201).json(holding);
  } catch (error) {
    console.error('Add holding error:', error);

    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Holding for this coin already exists'
      });
    }

    res.status(500).json({ message: 'Failed to add holding' });
  }
};

// @desc    Update holding
// @route   PUT /api/portfolio/:id
// @access  Private
const updateHolding = async (req, res) => {
  try {
    const { amount, buyPrice, notes, tags } = req.body;

    const holding = await Portfolio.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!holding) {
      return res.status(404).json({ message: 'Holding not found' });
    }

    // Update fields if provided
    if (amount !== undefined) holding.amount = parseFloat(amount);
    if (buyPrice !== undefined) holding.buyPrice = parseFloat(buyPrice);
    if (notes !== undefined) holding.notes = notes;
    if (tags !== undefined) holding.tags = tags;

    // Get current price
    const prices = await coingeckoService.getPrices([holding.coinId]);
    holding.currentPrice = prices[holding.coinId]?.usd || holding.currentPrice;

    // Recalculate metrics
    holding.value = holding.amount * holding.currentPrice;
    holding.profitLoss = holding.value - (holding.amount * holding.buyPrice);
    holding.profitLossPercentage = holding.buyPrice > 0
      ? (holding.profitLoss / (holding.amount * holding.buyPrice)) * 100
      : 0;

    await holding.save();

    res.json(holding);
  } catch (error) {
    console.error('Update holding error:', error);
    res.status(500).json({ message: 'Failed to update holding' });
  }
};

// @desc    Delete holding
// @route   DELETE /api/portfolio/:id
// @access  Private
const deleteHolding = async (req, res) => {
  try {
    const holding = await Portfolio.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!holding) {
      return res.status(404).json({ message: 'Holding not found' });
    }

    res.json({ message: 'Holding removed successfully' });
  } catch (error) {
    console.error('Delete holding error:', error);
    res.status(500).json({ message: 'Failed to delete holding' });
  }
};

// @desc    Get portfolio chart data
// @route   GET /api/portfolio/chart
// @access  Private
const getPortfolioChart = async (req, res) => {
  try {
    const { days = '30' } = req.query;
    const holdings = await Portfolio.find({ userId: req.user._id });

    if (holdings.length === 0) {
      return res.json({ timestamps: [], values: [] });
    }

    // Get historical data for each coin
    const historicalData = await Promise.all(
      holdings.map(async (holding) => {
        try {
          const data = await coingeckoService.getHistoricalData(holding.coinId, days);
          return {
            coinId: holding.coinId,
            amount: holding.amount,
            prices: data.prices || []
          };
        } catch (error) {
          console.error(`Error fetching historical data for ${holding.coinId}:`, error);
          return { coinId: holding.coinId, amount: holding.amount, prices: [] };
        }
      })
    );

    // Combine portfolio value over time
    const combinedData = {};

    historicalData.forEach(coinData => {
      coinData.prices.forEach(([timestamp, price]) => {
        const date = new Date(timestamp).toISOString().split('T')[0];
        const value = coinData.amount * price;

        if (!combinedData[date]) {
          combinedData[date] = { timestamp, totalValue: 0 };
        }
        combinedData[date].totalValue += value;
      });
    });

    // Convert to arrays for chart
    const sortedDates = Object.keys(combinedData).sort();
    const timestamps = sortedDates.map(date => combinedData[date].timestamp);
    const values = sortedDates.map(date => combinedData[date].totalValue);

    res.json({ timestamps, values });
  } catch (error) {
    console.error('Get portfolio chart error:', error);
    res.status(500).json({ message: 'Failed to fetch chart data' });
  }
};

module.exports = {
  getPortfolio,
  addHolding,
  updateHolding,
  deleteHolding,
  getPortfolioChart
};