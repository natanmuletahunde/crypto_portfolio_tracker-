const { coingeckoClient } = require('../config/coingecko');

class CoinGeckoService {
  /**
   * Get current prices for multiple coins
   * @param {Array} coinIds - Array of coin IDs
   * @returns {Object} Prices object
   */
  async getPrices(coinIds) {
    try {
      if (!coinIds || coinIds.length === 0) return {};

      const response = await coingeckoClient.get('/simple/price', {
        params: {
          ids: coinIds.join(','),
          vs_currencies: 'usd',
          include_market_cap: false,
          include_24hr_vol: false,
          include_24hr_change: true,
          include_last_updated_at: true
        }
      });

      return response.data;
    } catch (error) {
      console.error('CoinGecko API Error:', error.message);
      throw new Error('Failed to fetch prices from CoinGecko');
    }
  }

  /**
   * Get coin market data
   * @param {Array} coinIds - Array of coin IDs
   * @param {String} currency - Currency (default: usd)
   * @returns {Array} Market data
   */
  async getMarketData(coinIds, currency = 'usd') {
    try {
      const response = await coingeckoClient.get('/coins/markets', {
        params: {
          vs_currency: currency,
          ids: coinIds.join(','),
          order: 'market_cap_desc',
          per_page: 100,
          page: 1,
          sparkline: false,
          price_change_percentage: '1h,24h,7d'
        }
      });

      return response.data;
    } catch (error) {
      console.error('CoinGecko Market Data Error:', error.message);
      throw new Error('Failed to fetch market data');
    }
  }

  /**
   * Get coin historical data
   * @param {String} coinId - Coin ID
   * @param {String} days - Number of days (1, 7, 30, 90, 365, max)
   * @param {String} currency - Currency (default: usd)
   * @returns {Array} Historical data
   */
  async getHistoricalData(coinId, days = '30', currency = 'usd') {
    try {
      const response = await coingeckoClient.get(`/coins/${coinId}/market_chart`, {
        params: {
          vs_currency: currency,
          days: days
        }
      });

      return response.data;
    } catch (error) {
      console.error('CoinGecko Historical Data Error:', error.message);
      throw new Error('Failed to fetch historical data');
    }
  }

  /**
   * Search for coins
   * @param {String} query - Search query
   * @returns {Array} Search results
   */
  async searchCoins(query) {
    try {
      const response = await coingeckoClient.get('/search', {
        params: { query }
      });

      return response.data.coins;
    } catch (error) {
      console.error('CoinGecko Search Error:', error.message);
      throw new Error('Failed to search coins');
    }
  }

  /**
   * Get trending coins
   * @returns {Array} Trending coins
   */
  async getTrending() {
    try {
      const response = await coingeckoClient.get('/search/trending');
      return response.data.coins.map(coin => coin.item);
    } catch (error) {
      console.error('CoinGecko Trending Error:', error.message);
      throw new Error('Failed to fetch trending coins');
    }
  }
}

module.exports = new CoinGeckoService();