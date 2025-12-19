import React, { useState } from 'react';
import { formatCurrency } from '../utils/formatCurrency';
import { usePortfolio } from '../context/PortfolioContext';
import AddHoldingModal from './AddHoldingModal';

const CoinTable = ({ holdings = [] }) => {
  const { deleteHolding } = usePortfolio();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHolding, setEditingHolding] = useState(null);

  const handleEdit = (holding) => {
    setEditingHolding(holding);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this holding?')) {
      await deleteHolding(id);
    }
  };

  if (holdings.length === 0) {
    return (
      <div className="card">
        <div className="text-center py-12">
          <i className="ti ti-coins text-4xl text-gray-300 mb-4"></i>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Holdings Yet</h3>
          <p className="text-gray-500 mb-6">Start by adding your first cryptocurrency holding</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary"
          >
            <i className="ti ti-plus mr-2"></i>
            Add Holding
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Your Holdings</h2>
          <button
            onClick={() => {
              setEditingHolding(null);
              setIsModalOpen(true);
            }}
            className="btn-primary text-sm"
          >
            <i className="ti ti-plus mr-2"></i>
            Add Holding
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="table-header">Coin</th>
                <th className="table-header">Amount</th>
                <th className="table-header">Buy Price</th>
                <th className="table-header">Current Price</th>
                <th className="table-header">Value</th>
                <th className="table-header">P&L</th>
                <th className="table-header">% Change</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {holdings.map((holding) => {
                const isPositive = holding.profitLoss >= 0;
                const isNegative = holding.profitLoss < 0;

                return (
                  <tr key={holding._id} className="hover:bg-gray-50">
                    <td className="table-cell">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-lg font-semibold text-gray-700">
                            {holding.symbol.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {holding.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {holding.symbol}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="text-sm font-medium text-gray-900">
                        {holding.amount.toFixed(8)}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="text-sm text-gray-900">
                        {formatCurrency(holding.buyPrice)}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="text-sm text-gray-900">
                        {formatCurrency(holding.currentPrice)}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(holding.value)}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className={`text-sm font-medium ${
                        isPositive ? 'text-green-600' :
                        isNegative ? 'text-red-600' :
                        'text-gray-600'
                      }`}>
                        {formatCurrency(holding.profitLoss)}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className={`text-sm font-medium ${
                        isPositive ? 'text-green-600' :
                        isNegative ? 'text-red-600' :
                        'text-gray-600'
                      }`}>
                        {holding.profitLossPercentage.toFixed(2)}%
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(holding)}
                          className="text-primary-600 hover:text-primary-900 p-1"
                          title="Edit"
                        >
                          <i className="ti ti-edit"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(holding._id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete"
                        >
                          <i className="ti ti-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <AddHoldingModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingHolding(null);
          }}
          holding={editingHolding}
        />
      )}
    </>
  );
};

export default CoinTable;