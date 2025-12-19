const alertService = require('../services/alertService');

// @desc    Get user alerts
// @route   GET /api/alerts
// @access  Private
const getAlerts = async (req, res) => {
  try {
    const alerts = await alertService.getUserAlerts(req.user._id);
    res.json(alerts);
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({ message: 'Failed to fetch alerts' });
  }
};

// @desc    Create alert
// @route   POST /api/alerts
// @access  Private
const createAlert = async (req, res) => {
  try {
    const alert = await alertService.createAlert(req.user._id, req.body);
    res.status(201).json(alert);
  } catch (error) {
    console.error('Create alert error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update alert
// @route   PUT /api/alerts/:id
// @access  Private
const updateAlert = async (req, res) => {
  try {
    const alert = await alertService.updateAlert(req.params.id, req.user._id, req.body);
    res.json(alert);
  } catch (error) {
    console.error('Update alert error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete alert
// @route   DELETE /api/alerts/:id
// @access  Private
const deleteAlert = async (req, res) => {
  try {
    const success = await alertService.deleteAlert(req.params.id, req.user._id);

    if (!success) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    res.json({ message: 'Alert deleted successfully' });
  } catch (error) {
    console.error('Delete alert error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle alert status
// @route   PATCH /api/alerts/:id/toggle
// @access  Private
const toggleAlert = async (req, res) => {
  try {
    const alert = await alertService.updateAlert(
      req.params.id,
      req.user._id,
      { isActive: req.body.isActive }
    );
    res.json(alert);
  } catch (error) {
    console.error('Toggle alert error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAlerts,
  createAlert,
  updateAlert,
  deleteAlert,
  toggleAlert
};