const coingeckoService = require('../services/coingeckoService');

// @desc    Get current prices for multiple coins
// @route   GET /api/prices
// @access  Public
const getPrices = async (req, res) => {
  try {
    const { coins } = req.query;

    if (!coins) {
      return res.status(400).json({ message: 'Coins parameter is required' });
    }

    const coinIds = coins.split(',');
    const prices = await coingeckoService.getPrices(coinIds);

    res.json(prices);
  } catch (error) {
    console.error('Get prices error:', error);
    res.status(500).json({ message: 'Failed to fetch prices' });
  }
};

// @desc    Get market data for coins
// @route   GET /api/prices/market
// @access  Public
const getMarketData = async (req, res) => {
  try {
    const { coins, currency = 'usd' } = req.query;

    if (!coins) {
      return res.status(400).json({ message: 'Coins parameter is required' });
    }

    const coinIds = coins.split(',');
    const marketData = await coingeckoService.getMarketData(coinIds, currency);

    res.json(marketData);
  } catch (error) {
    console.error('Get market data error:', error);
    res.status(500).json({ message: 'Failed to fetch market data' });
  }
};

// @desc    Get historical price data
// @route   GET /api/prices/historical/:coinId
// @access  Public
const getHistoricalData = async (req, res) => {
  try {
    const { coinId } = req.params;
    const { days = '30', currency = 'usd' } = req.query;

    const data = await coingeckoService.getHistoricalData(coinId, days, currency);

    res.json(data);
  } catch (error) {
    console.error('Get historical data error:', error);
    res.status(500).json({ message: 'Failed to fetch historical data' });
  }
};

// @desc    Search for coins
// @route   GET /api/prices/search
// @access  Public
const searchCoins = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.length < 2) {
      return res.status(400).json({ message: 'Search query must be at least 2 characters' });
    }

    const results = await coingeckoService.searchCoins(query);

    res.json(results);
  } catch (error) {
    console.error('Search coins error:', error);
    res.status(500).json({ message: 'Failed to search coins' });
  }
};

// @desc    Get trending coins
// @route   GET /api/prices/trending
// @access  Public
const getTrending = async (req, res) => {
  try {
    const trending = await coingeckoService.getTrending();
    res.json(trending);
  } catch (error) {
    console.error('Get trending error:', error);
    res.status(500).json({ message: 'Failed to fetch trending coins' });
  }
};

module.exports = {
  getPrices,
  getMarketData,
  getHistoricalData,
  searchCoins,
  getTrending
};