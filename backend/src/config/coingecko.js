const axios = require('axios');

const COINGECKO_API = {
  baseURL: process.env.COINGECKO_API_URL,
  timeout: 10000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
};

const coingeckoClient = axios.create(COINGECKO_API);

module.exports = { coingeckoClient };