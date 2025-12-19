import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import CoinGeckoAPI from '../api/coingecko';
import toast from 'react-hot-toast';

const AddHoldingModal = ({ isOpen, onClose, holding }) => {
  const { addHolding, updateHolding } = usePortfolio();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [formData, setFormData] = useState({
    coinId: '',
    symbol: '',
    name: '',
    amount: '',
    buyPrice: '',
    buyDate: new Date().toISOString().split('T')[0],
    notes: '',
    tags: ''
  });

  useEffect(() => {
    if (holding) {
      setFormData({
        coinId: holding.coinId,
        symbol: holding.symbol,
        name: holding.name,
        amount: holding.amount.toString(),
        buyPrice: holding.buyPrice.toString(),
        buyDate: holding.buyDate ? new Date(holding.buyDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        notes: holding.notes || '',
        tags: holding.tags?.join(', ') || ''
      });
    }
  }, [holding]);

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
      symbol: coin.symbol.toUpperCase(),
      name: coin.name
    });
    setSearchResults([]);
    setSearchQuery(`${coin.name} (${coin.symbol.toUpperCase()})`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.coinId || !formData.amount || !formData.buyPrice) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const holdingData = {
        ...formData,
        amount: parseFloat(formData.amount),
        buyPrice: parseFloat(formData.buyPrice),
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
      };

      if (holding) {
        await updateHolding(holding._id, holdingData);
      } else {
        await addHolding(holdingData);
      }

      onClose();
    } catch (error) {
      console.error('Error saving holding:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  {holding ? 'Edit Holding' : 'Add New Holding'}
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
                        Selected: {formData.name} ({formData.symbol})
                      </div>
                    )}
                  </div>

                  {/* Amount and Buy Price */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amount *
                      </label>
                      <input
                        type="number"
                        step="0.00000001"
                        min="0.00000001"
                        value={formData.amount}
                        onChange={(e) => setFormData({...formData, amount: e.target.value})}
                        className="input-field"
                        placeholder="0.00000000"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Buy Price (USD) *
                      </label>
                      <input
                        type="number"
                        step="0.0001"
                        min="0"
                        value={formData.buyPrice}
                        onChange={(e) => setFormData({...formData, buyPrice: e.target.value})}
                        className="input-field"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>

                  {/* Buy Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Buy Date
                    </label>
                    <input
                      type="date"
                      value={formData.buyDate}
                      onChange={(e) => setFormData({...formData, buyDate: e.target.value})}
                      className="input-field"
                    />
                  </div>

                  {/* Notes and Tags */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notes
                      </label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        className="input-field"
                        rows="3"
                        placeholder="Add any notes..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tags
                      </label>
                      <input
                        type="text"
                        value={formData.tags}
                        onChange={(e) => setFormData({...formData, tags: e.target.value})}
                        className="input-field"
                        placeholder="comma, separated, tags"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={onClose}
                        className="btn-secondary"
                        disabled={loading}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <i className="ti ti-loader animate-spin mr-2"></i>
                            Saving...
                          </>
                        ) : (
                          <>
                            <i className="ti ti-check mr-2"></i>
                            {holding ? 'Update' : 'Add'} Holding
                          </>
                        )}
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

export default AddHoldingModal;