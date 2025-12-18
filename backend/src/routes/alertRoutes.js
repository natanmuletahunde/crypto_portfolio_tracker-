const express = require('express');
const router = express.Router();
const {
  getAlerts,
  createAlert,
  updateAlert,
  deleteAlert,
  toggleAlert
} = require('../controllers/alertController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

router.route('/')
  .get(getAlerts)
  .post(createAlert);

router.route('/:id')
  .put(updateAlert)
  .delete(deleteAlert);

router.patch('/:id/toggle', toggleAlert);

module.exports = router;