import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import PortfolioCard from '../components/PortfolioCard';
import CoinTable from '../components/CoinTable';
import PortfolioChart from '../components/PortfolioChart';
import AddHoldingModal from '../components/AddHoldingModal';

const Portfolio = () => {
  const { portfolio, loading } = usePortfolio();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeRange, setTimeRange] = useState('30d');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <i className="ti ti-loader animate-spin text-4xl text-primary-600 mb-4"></i>
          <p className="text-gray-600">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Portfolio</h1>
          <p className="text-gray-600 mt-1">
            Track and manage your cryptocurrency investments
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary mt-4 md:mt-0"
        >
          <i className="ti ti-plus mr-2"></i>
          Add Holding
        </button>
      </div>

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

      {/* Holdings Table */}
      <CoinTable holdings={portfolio?.holdings || []} />

      {/* Add Holding Modal */}
      {isModalOpen && (
        <AddHoldingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Portfolio;