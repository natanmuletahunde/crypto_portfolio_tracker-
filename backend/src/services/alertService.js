const Alert = require('../models/Alert');
const coingeckoService = require('./coingeckoService');
const { emitAlert } = require('../sockets/priceSocket');

class AlertService {
  /**
   * Check and trigger alerts for a user
   * @param {String} userId - User ID
   * @param {Object} currentPrices - Current prices
   */
  async checkAlerts(userId, currentPrices) {
    try {
      const alerts = await Alert.find({
        userId,
        isActive: true,
        triggered: false
      });

      const triggeredAlerts = [];

      for (const alert of alerts) {
        const currentPrice = currentPrices[alert.coinId]?.usd;

        if (currentPrice) {
          let shouldTrigger = false;

          if (alert.condition === 'above' && currentPrice >= alert.alertPrice) {
            shouldTrigger = true;
          } else if (alert.condition === 'below' && currentPrice <= alert.alertPrice) {
            shouldTrigger = true;
          }

          if (shouldTrigger) {
            alert.triggered = true;
            alert.triggeredAt = new Date();
            await alert.save();

            triggeredAlerts.push({
              coinId: alert.coinId,
              coinSymbol: alert.coinSymbol,
              coinName: alert.coinName,
              alertPrice: alert.alertPrice,
              currentPrice: currentPrice,
              condition: alert.condition,
              triggeredAt: alert.triggeredAt
            });

            // Emit socket notification
            emitAlert(userId, {
              type: 'PRICE_ALERT',
              data: triggeredAlerts[triggeredAlerts.length - 1]
            });
          }
        }
      }

      return triggeredAlerts;
    } catch (error) {
      console.error('Alert check error:', error);
      return [];
    }
  }

  /**
   * Get user alerts
   * @param {String} userId - User ID
   * @returns {Array} User alerts
   */
  async getUserAlerts(userId) {
    try {
      return await Alert.find({ userId }).sort({ createdAt: -1 });
    } catch (error) {
      console.error('Get alerts error:', error);
      return [];
    }
  }

  /**
   * Create new alert
   * @param {String} userId - User ID
   * @param {Object} alertData - Alert data
   * @returns {Object} Created alert
   */
  async createAlert(userId, alertData) {
    try {
      const alert = new Alert({
        userId,
        ...alertData
      });

      return await alert.save();
    } catch (error) {
      console.error('Create alert error:', error);
      throw new Error('Failed to create alert');
    }
  }

  /**
   * Update alert
   * @param {String} alertId - Alert ID
   * @param {String} userId - User ID
   * @param {Object} updates - Alert updates
   * @returns {Object} Updated alert
   */
  async updateAlert(alertId, userId, updates) {
    try {
      const alert = await Alert.findOneAndUpdate(
        { _id: alertId, userId },
        updates,
        { new: true, runValidators: true }
      );

      if (!alert) {
        throw new Error('Alert not found');
      }

      return alert;
    } catch (error) {
      console.error('Update alert error:', error);
      throw new Error('Failed to update alert');
    }
  }

  /**
   * Delete alert
   * @param {String} alertId - Alert ID
   * @param {String} userId - User ID
   * @returns {Boolean} Success status
   */
  async deleteAlert(alertId, userId) {
    try {
      const result = await Alert.findOneAndDelete({ _id: alertId, userId });
      return !!result;
    } catch (error) {
      console.error('Delete alert error:', error);
      throw new Error('Failed to delete alert');
    }
  }
}

module.exports = new AlertService();