import React, { useEffect, useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import PortfolioCard from '../components/PortfolioCard';
import PortfolioChart from '../components/PortfolioChart';
import AlertsList from '../components/AlertsList';
import TrendingCoins from '../components/TrendingCoins';
import WalletConnect from '../components/WalletConnect';

const Dashboard = () => {
  // eslint-disable-next-line no-unused-vars
  const { portfolio, loading, fetchPortfolio } = usePortfolio();
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    fetchPortfolio();
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl text-white p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back!</h1>
            <p className="text-primary-100">
              Track your crypto portfolio in real-time with live prices and analytics.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <i className="ti ti-refresh mr-2"></i>
              <span>Live Prices Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Portfolio Overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Portfolio Summary */}
          <PortfolioCard portfolio={portfolio} />

          {/* Portfolio Chart */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Portfolio Performance</h2>
              <div className="flex space-x-2">
                {['24h', '7d', '30d', '90d'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                      timeRange === range
                        ? 'bg-primary-100 text-primary-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
            <PortfolioChart timeRange={timeRange} />
          </div>

          {/* Trending Coins */}
          <TrendingCoins />
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Wallet Connect */}
          <WalletConnect />

          {/* Price Alerts */}
          <AlertsList />

          {/* Quick Stats */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Holdings</span>
                <span className="font-medium text-gray-900">
                  {portfolio?.holdings?.length || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Alerts</span>
                <span className="font-medium text-gray-900">0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">24h Change</span>
                <span className="font-medium text-green-600">+2.5%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Market Sentiment</span>
                <span className="font-medium text-green-600">Bullish</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;