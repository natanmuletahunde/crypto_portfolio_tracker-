export const calculateProfitLoss = (amount, buyPrice, currentPrice) => {
    const cost = amount * buyPrice;
    const value = amount * currentPrice;
    return value - cost;
  };

  export const calculateProfitLossPercentage = (buyPrice, currentPrice) => {
    if (!buyPrice || buyPrice === 0) return 0;
    return ((currentPrice - buyPrice) / buyPrice) * 100;
  };

  export const calculatePortfolioAllocation = (holdings) => {
    if (!holdings || holdings.length === 0) return [];

    const totalValue = holdings.reduce((sum, holding) => sum + (holding.value || 0), 0);

    return holdings.map(holding => ({
      ...holding,
      allocation: totalValue > 0 ? (holding.value / totalValue) * 100 : 0
    }));
  };

  export const calculateAverageBuyPrice = (holdings) => {
    if (!holdings || holdings.length === 0) return 0;

    const totalAmount = holdings.reduce((sum, h) => sum + h.amount, 0);
    const totalCost = holdings.reduce((sum, h) => sum + (h.amount * h.buyPrice), 0);

    return totalAmount > 0 ? totalCost / totalAmount : 0;
  };

  export const calculateUnrealizedGains = (holdings) => {
    if (!holdings || holdings.length === 0) return 0;

    return holdings.reduce((total, holding) => {
      const profitLoss = calculateProfitLoss(holding.amount, holding.buyPrice, holding.currentPrice || 0);
      return total + profitLoss;
    }, 0);
  };