import React from 'react';
import { formatCurrency } from '../utils/formatCurrency';

const PortfolioCard = ({ portfolio }) => {
  if (!portfolio) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <i className="ti ti-wallet-off text-4xl text-gray-300 mb-4"></i>
          <p className="text-gray-500">No portfolio data available</p>
        </div>
      </div>
    );
  }

  const {
    totalValue,
    totalCost,
    totalProfitLoss,
    totalProfitLossPercentage
  } = portfolio;

  const isPositive = totalProfitLoss >= 0;
  const isNegative = totalProfitLoss < 0;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Portfolio Summary</h2>
        <div className="px-3 py-1 bg-gray-100 rounded-full">
          <span className="text-sm font-medium text-gray-700">
            {portfolio.holdings?.length || 0} holdings
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Value */}
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-4 rounded-lg">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-primary-500 rounded-lg">
              <i className="ti ti-wallet text-white"></i>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalValue)}
              </p>
            </div>
          </div>
        </div>

        {/* Total Cost */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-blue-500 rounded-lg">
              <i className="ti ti-cash text-white"></i>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Cost</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalCost)}
              </p>
            </div>
          </div>
        </div>

        {/* Profit/Loss */}
        <div className={`p-4 rounded-lg ${
          isPositive ? 'bg-gradient-to-br from-green-50 to-green-100' :
          isNegative ? 'bg-gradient-to-br from-red-50 to-red-100' :
          'bg-gradient-to-br from-gray-50 to-gray-100'
        }`}>
          <div className="flex items-center space-x-3 mb-2">
            <div className={`p-2 rounded-lg ${
              isPositive ? 'bg-green-500' :
              isNegative ? 'bg-red-500' :
              'bg-gray-500'
            }`}>
              <i className={`ti ${
                isPositive ? 'ti-trending-up' :
                isNegative ? 'ti-trending-down' :
                'ti-minus'
              } text-white`}></i>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total P&L</p>
              <p className={`text-2xl font-bold ${
                isPositive ? 'text-green-700' :
                isNegative ? 'text-red-700' :
                'text-gray-700'
              }`}>
                {formatCurrency(totalProfitLoss)}
              </p>
            </div>
          </div>
        </div>

        {/* Percentage Change */}
        <div className={`p-4 rounded-lg ${
          isPositive ? 'bg-gradient-to-br from-green-50 to-green-100' :
          isNegative ? 'bg-gradient-to-br from-red-50 to-red-100' :
          'bg-gradient-to-br from-gray-50 to-gray-100'
        }`}>
          <div className="flex items-center space-x-3 mb-2">
            <div className={`p-2 rounded-lg ${
              isPositive ? 'bg-green-500' :
              isNegative ? 'bg-red-500' :
              'bg-gray-500'
            }`}>
              <i className="ti ti-percentage text-white"></i>
            </div>
            <div>
              <p className="text-sm text-gray-600">% Change</p>
              <p className={`text-2xl font-bold ${
                isPositive ? 'text-green-700' :
                isNegative ? 'text-red-700' :
                'text-gray-700'
              }`}>
                {totalProfitLossPercentage.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Indicator */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Performance</span>
          <span className={`text-sm font-medium ${
            isPositive ? 'text-green-600' :
            isNegative ? 'text-red-600' :
            'text-gray-600'
          }`}>
            {isPositive ? 'Profitable' : isNegative ? 'At Loss' : 'Neutral'}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${
              isPositive ? 'bg-green-500' :
              isNegative ? 'bg-red-500' :
              'bg-gray-500'
            }`}
            style={{
              width: `${Math.min(Math.abs(totalProfitLossPercentage) * 2, 100)}%`
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioCard;