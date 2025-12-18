const express = require('express');
const router = express.Router();
const {
  getPrices,
  getMarketData,
  getHistoricalData,
  searchCoins,
  getTrending
} = require('../controllers/priceController');

// Public routes (caching recommended for production)
router.get('/', getPrices);
router.get('/market', getMarketData);
router.get('/historical/:coinId', getHistoricalData);
router.get('/search', searchCoins);
router.get('/trending', getTrending);

module.exports = router;