import apiClient from './axios';

const CoinGeckoAPI = {
  // Get current prices
  getPrices: async (coinIds) => {
    try {
      const response = await apiClient.get(`/prices?coins=${coinIds.join(',')}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching prices:', error);
      throw error;
    }
  },

  // Get market data
  getMarketData: async (coinIds) => {
    try {
      const response = await apiClient.get(`/prices/market?coins=${coinIds.join(',')}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching market data:', error);
      throw error;
    }
  },

  // Get historical data
  getHistoricalData: async (coinId, days = '30') => {
    try {
      const response = await apiClient.get(`/prices/historical/${coinId}?days=${days}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching historical data:', error);
      throw error;
    }
  },

  // Search coins
  searchCoins: async (query) => {
    try {
      const response = await apiClient.get(`/prices/search?query=${query}`);
      return response.data;
    } catch (error) {
      console.error('Error searching coins:', error);
      throw error;
    }
  },

  // Get trending coins
  getTrending: async () => {
    try {
      const response = await apiClient.get('/prices/trending');
      return response.data;
    } catch (error) {
      console.error('Error fetching trending coins:', error);
      throw error;
    }
  },
};

export default CoinGeckoAPI;