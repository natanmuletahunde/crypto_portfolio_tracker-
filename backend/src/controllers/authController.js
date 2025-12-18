const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({
        message: 'User already exists with this email or username'
      });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add wallet address
// @route   POST /api/auth/wallet
// @access  Private
const addWallet = async (req, res) => {
  try {
    const { address, name } = req.body;

    // Validate Ethereum address
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return res.status(400).json({ message: 'Invalid Ethereum address' });
    }

    const user = await User.findById(req.user._id);

    // Check if wallet already exists
    if (user.wallets.some(wallet => wallet.address.toLowerCase() === address.toLowerCase())) {
      return res.status(400).json({ message: 'Wallet already added' });
    }

    // Add wallet
    user.wallets.push({
      address,
      name: name || `Wallet ${user.wallets.length + 1}`
    });

    await user.save();

    res.json({ message: 'Wallet added successfully', wallets: user.wallets });
  } catch (error) {
    console.error('Add wallet error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Remove wallet address
// @route   DELETE /api/auth/wallet/:address
// @access  Private
const removeWallet = async (req, res) => {
  try {
    const { address } = req.params;

    const user = await User.findById(req.user._id);
    user.wallets = user.wallets.filter(wallet =>
      wallet.address.toLowerCase() !== address.toLowerCase()
    );

    await user.save();

    res.json({ message: 'Wallet removed successfully', wallets: user.wallets });
  } catch (error) {
    console.error('Remove wallet error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  addWallet,
  removeWallet
};