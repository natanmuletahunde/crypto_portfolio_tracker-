const express = require('express');
const router = express.Router();
const {
  getPortfolio,
  addHolding,
  updateHolding,
  deleteHolding,
  getPortfolioChart
} = require('../controllers/portfolioController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

router.route('/')
  .get(getPortfolio)
  .post(addHolding);

router.route('/:id')
  .put(updateHolding)
  .delete(deleteHolding);

router.get('/chart/data', getPortfolioChart);

module.exports = router;