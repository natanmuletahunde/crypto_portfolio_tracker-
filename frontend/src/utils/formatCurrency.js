export const formatCurrency = (value) => {
    if (value === undefined || value === null) return '$0.00';

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: value < 1 ? 8 : 2
    }).format(value);
  };

  export const formatPercentage = (value) => {
    if (value === undefined || value === null) return '0.00%';

    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  export const formatNumber = (value, decimals = 2) => {
    if (value === undefined || value === null) return '0';

    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(decimals)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(decimals)}K`;
    } else {
      return value.toFixed(decimals);
    }
  };

  export const formatCryptoAmount = (value) => {
    if (value === undefined || value === null) return '0';

    if (value < 0.000001) {
      return value.toFixed(12).replace(/\.?0+$/, '');
    } else if (value < 0.001) {
      return value.toFixed(8).replace(/\.?0+$/, '');
    } else if (value < 1) {
      return value.toFixed(6).replace(/\.?0+$/, '');
    } else {
      return value.toFixed(4).replace(/\.?0+$/, '');
    }
  };