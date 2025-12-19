import React, { useState, useEffect } from 'react';
import CoinGeckoAPI from '../api/coingecko';
// eslint-disable-next-line no-unused-vars
import { formatCurrency } from '../utils/formatCurrency';

const TrendingCoins = () => {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const data = await CoinGeckoAPI.getTrending();
        setTrending(data.slice(0, 5)); // Show top 5 trending
      } catch (error) {
        console.error('Error fetching trending coins:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center h-32">
          <i className="ti ti-loader animate-spin text-primary-600"></i>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Trending Coins</h2>
      <div className="space-y-3">
        {trending.map((coin) => {
          // Extract price change percentage (using 24h change as example)
          const priceChange = coin.data?.price_change_percentage_24h?.usd || 0;
          const isPositive = priceChange >= 0;

          return (
            <div
              key={coin.id}
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={coin.thumb}
                  alt={coin.name}
                  className="w-8 h-8 rounded-full"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `
                      <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <span class="text-xs font-medium text-gray-500">${coin.symbol?.charAt(0) || '?'}</span>
                      </div>
                    `;
                  }}
                />
                <div>
                  <div className="font-medium text-gray-900">{coin.name}</div>
                  <div className="text-sm text-gray-500">{coin.symbol?.toUpperCase()}</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-medium ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Rank #{coin.market_cap_rank || 'N/A'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrendingCoins;