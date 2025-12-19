import React, { useEffect, useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import PriceAlertModal from './PriceAlertModal';

const AlertsList = () => {
  const { alerts, fetchAlerts, toggleAlert, deleteAlert } = usePortfolio();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'triggered'

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'active') return alert.isActive && !alert.triggered;
    if (filter === 'triggered') return alert.triggered;
    return true;
  });

  const handleToggleAlert = async (id, isActive) => {
    await toggleAlert(id, !isActive);
  };

  const handleDeleteAlert = async (id) => {
    if (window.confirm('Are you sure you want to delete this alert?')) {
      await deleteAlert(id);
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Price Alerts</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary text-sm"
        >
          <i className="ti ti-plus mr-1"></i>
          New Alert
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-4">
        {['all', 'active', 'triggered'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1 text-sm rounded-lg capitalize transition-colors ${
              filter === tab
                ? 'bg-primary-100 text-primary-700 font-medium'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab} ({tab === 'all' ? alerts.length :
                    tab === 'active' ? alerts.filter(a => a.isActive && !a.triggered).length :
                    alerts.filter(a => a.triggered).length})
          </button>
        ))}
      </div>

      {filteredAlerts.length === 0 ? (
        <div className="text-center py-8">
          <i className="ti ti-bell-off text-3xl text-gray-300 mb-3"></i>
          <p className="text-gray-500">
            {filter === 'all' ? 'No alerts created yet' :
             filter === 'active' ? 'No active alerts' :
             'No triggered alerts'}
          </p>
          {filter === 'all' && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 btn-primary text-sm"
            >
              Create your first alert
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAlerts.map((alert) => (
            <div
              key={alert._id}
              className={`p-4 rounded-lg border ${
                alert.triggered
                  ? 'bg-green-50 border-green-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium text-gray-900">
                      {alert.coinSymbol}
                    </span>
                    <span className="text-sm text-gray-500">
                      {alert.coinName}
                    </span>
                    {alert.triggered && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        Triggered
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    Alert when price is{' '}
                    <span className="font-medium text-gray-900">
                      {alert.condition} ${alert.alertPrice.toLocaleString()}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Created {new Date(alert.createdAt).toLocaleDateString()}
                    {alert.triggeredAt && (
                      <> • Triggered {new Date(alert.triggeredAt).toLocaleDateString()}</>
                    )}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {!alert.triggered && (
                    <button
                      onClick={() => handleToggleAlert(alert._id, alert.isActive)}
                      className={`p-2 rounded-lg ${
                        alert.isActive
                          ? 'text-green-600 hover:bg-green-100'
                          : 'text-gray-400 hover:bg-gray-100'
                      }`}
                      title={alert.isActive ? 'Disable' : 'Enable'}
                    >
                      <i className={`ti ${alert.isActive ? 'ti-toggle-left' : 'ti-toggle-right'}`}></i>
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteAlert(alert._id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                    title="Delete"
                  >
                    <i className="ti ti-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Alert Modal */}
      {isModalOpen && (
        <PriceAlertModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default AlertsList;