/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import CoinGeckoAPI from '../api/coingecko';
import toast from 'react-hot-toast';

const PriceAlertModal = ({ isOpen, onClose }) => {
  const { createAlert } = usePortfolio();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const [formData, setFormData] = useState({
    coinId: '',
    coinSymbol: '',
    coinName: '',
    alertPrice: '',
    condition: 'above'
  });

  const handleSearch = async (query) => {
    if (query.length < 2) return;

    setIsSearching(true);
    try {
      const results = await CoinGeckoAPI.searchCoins(query);
      setSearchResults(results.slice(0, 10));
    } catch (error) {
      toast.error('Failed to search coins');
    } finally {
      setIsSearching(false);
    }
  };

  const handleCoinSelect = (coin) => {
    setFormData({
      ...formData,
      coinId: coin.id,
      coinSymbol: coin.symbol.toUpperCase(),
      coinName: coin.name
    });
    setSearchResults([]);
    setSearchQuery(`${coin.name} (${coin.symbol.toUpperCase()})`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.coinId || !formData.alertPrice) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await createAlert(formData);
      toast.success('Alert created successfully');
      onClose();
      // Reset form
      setFormData({
        coinId: '',
        coinSymbol: '',
        coinName: '',
        alertPrice: '',
        condition: 'above'
      });
      setSearchQuery('');
    } catch (error) {
      console.error('Error creating alert:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Create Price Alert
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Coin Search */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cryptocurrency *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          handleSearch(e.target.value);
                        }}
                        className="input-field"
                        placeholder="Search for a cryptocurrency..."
                        required
                      />
                      {isSearching && (
                        <div className="absolute right-3 top-3">
                          <i className="ti ti-loader animate-spin"></i>
                        </div>
                      )}
                      {searchResults.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                          {searchResults.map((coin) => (
                            <button
                              key={coin.id}
                              type="button"
                              onClick={() => handleCoinSelect(coin)}
                              className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-3"
                            >
                              <img src={coin.thumb} alt="" className="w-6 h-6" />
                              <div>
                                <div className="font-medium">{coin.name}</div>
                                <div className="text-sm text-gray-500">{coin.symbol.toUpperCase()}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {formData.coinId && (
                      <div className="mt-2 text-sm text-gray-600">
                        Selected: {formData.coinName} ({formData.coinSymbol})
                      </div>
                    )}
                  </div>

                  {/* Alert Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Alert Price (USD) *
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      min="0"
                      value={formData.alertPrice}
                      onChange={(e) => setFormData({...formData, alertPrice: e.target.value})}
                      className="input-field"
                      placeholder="0.00"
                      required
                    />
                  </div>

                  {/* Condition */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Alert When Price Is
                    </label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          value="above"
                          checked={formData.condition === 'above'}
                          onChange={(e) => setFormData({...formData, condition: e.target.value})}
                          className="text-primary-600 focus:ring-primary-500 h-4 w-4"
                        />
                        <span className="ml-2 text-sm text-gray-700">Above</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          value="below"
                          checked={formData.condition === 'below'}
                          onChange={(e) => setFormData({...formData, condition: e.target.value})}
                          className="text-primary-600 focus:ring-primary-500 h-4 w-4"
                        />
                        <span className="ml-2 text-sm text-gray-700">Below</span>
                      </label>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={onClose}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn-primary"
                      >
                        <i className="ti ti-bell mr-2"></i>
                        Create Alert
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceAlertModal;