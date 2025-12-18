const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getProfile,
  addWallet,
  removeWallet
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', protect, getProfile);
router.post('/wallet', protect, addWallet);
router.delete('/wallet/:address', protect, removeWallet);

module.exports = router;