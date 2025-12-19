import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import PriceAlertModal from '../components/PriceAlertModal';
import WalletConnect from '../components/WalletConnect';

const Settings = () => {
  // eslint-disable-next-line no-unused-vars
  const { user, updateProfile } = useAuth();
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [notifications, setNotifications] = useState({
    priceAlerts: true,
    portfolioUpdates: true,
    marketNews: false,
    weeklyReports: true,
  });

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your account preferences and notifications
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile & Security */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Information */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    defaultValue={user?.username}
                    className="input-field bg-gray-50"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={user?.email}
                    className="input-field bg-gray-50"
                    readOnly
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Member Since
                </label>
                <input
                  type="text"
                  defaultValue={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  className="input-field bg-gray-50"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h2>
            <div className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </p>
                    <p className="text-sm text-gray-500">
                      {key === 'priceAlerts' && 'Get notified when prices hit your targets'}
                      {key === 'portfolioUpdates' && 'Receive daily portfolio performance updates'}
                      {key === 'marketNews' && 'Get important market news and updates'}
                      {key === 'weeklyReports' && 'Receive weekly portfolio reports'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleNotificationChange(key)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      value ? 'bg-primary-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        value ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Security Settings */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Security</h2>
            <div className="space-y-4">
              <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Change Password</p>
                    <p className="text-sm text-gray-500">Update your account password</p>
                  </div>
                  <i className="ti ti-chevron-right text-gray-400"></i>
                </div>
              </button>
              <button className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-500">Add an extra layer of security</p>
                  </div>
                  <i className="ti ti-chevron-right text-gray-400"></i>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Alerts & Wallet */}
        <div className="space-y-6">
          {/* Create Alert Card */}
          <div className="card">
            <div className="text-center py-4">
              <i className="ti ti-bell text-3xl text-primary-600 mb-4"></i>
              <h3 className="font-medium text-gray-900 mb-2">Create Price Alert</h3>
              <p className="text-sm text-gray-500 mb-4">
                Get notified when your favorite cryptocurrencies hit target prices
              </p>
              <button
                onClick={() => setIsAlertModalOpen(true)}
                className="btn-primary w-full"
              >
                <i className="ti ti-plus mr-2"></i>
                New Alert
              </button>
            </div>
          </div>

          {/* Wallet Connection */}
          <WalletConnect />

          {/* Export Data */}
          <div className="card">
            <h3 className="font-medium text-gray-900 mb-4">Export Data</h3>
            <div className="space-y-3">
              <button className="w-full btn-secondary">
                <i className="ti ti-file-export mr-2"></i>
                Export Portfolio CSV
              </button>
              <button className="w-full btn-secondary">
                <i className="ti ti-file-text mr-2"></i>
                Export Transaction History
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Price Alert Modal */}
      {isAlertModalOpen && (
        <PriceAlertModal
          isOpen={isAlertModalOpen}
          onClose={() => setIsAlertModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Settings;