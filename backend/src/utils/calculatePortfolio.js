/**
 * Calculate portfolio metrics
 * @param {Array} holdings - Array of portfolio holdings
 * @returns {Object} Portfolio summary
 */
const calculatePortfolioSummary = (holdings) => {
    if (!holdings || holdings.length === 0) {
      return {
        totalValue: 0,
        totalCost: 0,
        totalProfitLoss: 0,
        totalProfitLossPercentage: 0,
        holdings: []
      };
    }

    let totalCost = 0;
    let totalValue = 0;
    let totalProfitLoss = 0;

    // Calculate metrics for each holding and totals
    const holdingsWithMetrics = holdings.map(holding => {
      const cost = holding.amount * holding.buyPrice;
      const value = holding.amount * (holding.currentPrice || 0);
      const profitLoss = value - cost;
      const profitLossPercentage = cost > 0 ? (profitLoss / cost) * 100 : 0;

      totalCost += cost;
      totalValue += value;
      totalProfitLoss += profitLoss;

      return {
        ...holding.toObject(),
        cost,
        value,
        profitLoss,
        profitLossPercentage
      };
    });

    const totalProfitLossPercentage = totalCost > 0 ? (totalProfitLoss / totalCost) * 100 : 0;

    return {
      totalValue,
      totalCost,
      totalProfitLoss,
      totalProfitLossPercentage,
      holdings: holdingsWithMetrics
    };
  };

  /**
   * Calculate wallet portfolio from balances
   * @param {Array} balances - Array of wallet balances
   * @param {Object} prices - Current prices from CoinGecko
   * @returns {Object} Wallet portfolio summary
   */
  const calculateWalletPortfolio = (balances, prices) => {
    let totalValue = 0;
    const holdings = [];

    Object.entries(balances).forEach(([symbol, amount]) => {
      const coinId = symbol.toLowerCase();
      const price = prices[coinId]?.usd || 0;
      const value = amount * price;

      totalValue += value;

      holdings.push({
        symbol: symbol.toUpperCase(),
        amount,
        currentPrice: price,
        value,
        coinId
      });
    });

    return {
      totalValue,
      holdings
    };
  };

  module.exports = {
    calculatePortfolioSummary,
    calculateWalletPortfolio
  };