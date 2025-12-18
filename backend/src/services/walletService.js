const axios = require('axios');

class WalletService {
  /**
   * Get token balances from Ethereum wallet
   * @param {String} address - Wallet address
   * @returns {Object} Token balances
   */
  async getEthereumWalletBalances(address) {
    try {
      // Using Covalent API for token balances (free tier available)
      // Alternative: Use Etherscan API or Moralis
      const COVALENT_API_KEY = 'ckey_XXXXXXXXXXXXXXXXXXXXXX'; // Replace with your key
      const response = await axios.get(
        `https://api.covalenthq.com/v1/1/address/${address}/balances_v2/`,
        {
          params: {
            key: COVALENT_API_KEY,
            nft: false,
            'quote-currency': 'USD'
          }
        }
      );

      const balances = {};
      response.data.data.items.forEach(item => {
        if (item.balance > 0) {
          const symbol = item.contract_ticker_symbol;
          const amount = item.balance / Math.pow(10, item.contract_decimals);
          balances[symbol] = (balances[symbol] || 0) + amount;
        }
      });

      return balances;
    } catch (error) {
      console.error('Wallet balance fetch error:', error);

      // Fallback: Return only ETH balance using ethers.js would be handled in frontend
      return { ETH: 0 };
    }
  }

  /**
   * Get multiple wallet balances
   * @param {Array} addresses - Array of wallet addresses
   * @returns {Object} Combined balances
   */
  async getMultipleWalletBalances(addresses) {
    const allBalances = {};

    for (const address of addresses) {
      try {
        const balances = await this.getEthereumWalletBalances(address);

        // Combine balances
        Object.entries(balances).forEach(([symbol, amount]) => {
          allBalances[symbol] = (allBalances[symbol] || 0) + amount;
        });
      } catch (error) {
        console.error(`Failed to fetch balances for ${address}:`, error);
      }
    }

    return allBalances;
  }

  /**
   * Validate Ethereum address
   * @param {String} address - Wallet address
   * @returns {Boolean} Is valid address
   */
  isValidEthereumAddress(address) {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }
}

module.exports = new WalletService();