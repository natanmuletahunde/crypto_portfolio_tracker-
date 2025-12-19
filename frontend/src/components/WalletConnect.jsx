/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const WalletConnect = () => {
  const { user, addWallet, removeWallet } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletBalance, setWalletBalance] = useState('0');
  const [isConnected, setIsConnected] = useState(false);
  const [provider, setProvider] = useState(null);

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window.ethereum !== 'undefined';
  };

  // Connect to MetaMask
  const connectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      toast.error('Please install MetaMask to connect your wallet');
      return;
    }

    try {
      setIsConnecting(true);

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const address = accounts[0];
      setWalletAddress(address);
      setIsConnected(true);

      // Create provider
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(web3Provider);

      // Get balance
      const balance = await web3Provider.getBalance(address);
      setWalletBalance(ethers.formatEther(balance));

      // Listen for account changes
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      toast.success('Wallet connected successfully!');
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error(error.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setWalletAddress('');
    setWalletBalance('0');
    setIsConnected(false);
    setProvider(null);

    // Remove event listeners
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    }

    toast.success('Wallet disconnected');
  };

  // Handle account changes
  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      setWalletAddress(accounts[0]);
    }
  };

  // Handle chain changes
  const handleChainChanged = () => {
    window.location.reload();
  };

  // Add wallet to profile
  const handleAddWallet = async () => {
    if (!walletAddress) {
      toast.error('Please connect your wallet first');
      return;
    }

    const result = await addWallet(walletAddress, 'MetaMask Wallet');
    if (result.success) {
      toast.success('Wallet added to your profile');
    }
  };

  // Check if wallet is already in user's wallets
  const isWalletAdded = () => {
    if (!user?.wallets || !walletAddress) return false;
    return user.wallets.some(wallet =>
      wallet.address.toLowerCase() === walletAddress.toLowerCase()
    );
  };

  // Format address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Wallet Connection</h2>
        <i className="ti ti-wallet text-2xl text-crypto-ethereum"></i>
      </div>

      {!isMetaMaskInstalled() ? (
        <div className="text-center py-6">
          <i className="ti ti-brand-metamask text-4xl text-gray-300 mb-4"></i>
          <p className="text-gray-700 mb-4">MetaMask is not installed</p>
          <a
            href="https://metamask.io/download/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-block"
          >
            Install MetaMask
          </a>
        </div>
      ) : !isConnected ? (
        <div className="text-center py-6">
          <i className="ti ti-wallet text-4xl text-gray-300 mb-4"></i>
          <p className="text-gray-700 mb-6">Connect your MetaMask wallet to track your holdings</p>
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="btn-primary"
          >
            {isConnecting ? (
              <>
                <i className="ti ti-loader animate-spin mr-2"></i>
                Connecting...
              </>
            ) : (
              <>
                <i className="ti ti-brand-metamask mr-2"></i>
                Connect MetaMask
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Connected Wallet</p>
                <p className="font-mono font-medium text-gray-900">
                  {formatAddress(walletAddress)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Balance</p>
                <p className="text-lg font-bold text-gray-900">
                  {parseFloat(walletBalance).toFixed(4)} ETH
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            {!isWalletAdded() ? (
              <button
                onClick={handleAddWallet}
                className="btn-primary text-sm"
              >
                <i className="ti ti-plus mr-2"></i>
                Add to Profile
              </button>
            ) : (
              <span className="text-sm text-green-600 flex items-center">
                <i className="ti ti-check mr-1"></i>
                Added to your profile
              </span>
            )}

            <button
              onClick={disconnectWallet}
              className="btn-secondary text-sm"
            >
              <i className="ti ti-logout mr-2"></i>
              Disconnect
            </button>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Connected Wallets in Profile:</p>
            {user?.wallets && user.wallets.length > 0 ? (
              <ul className="space-y-2">
                {user.wallets.map((wallet, index) => (
                  <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{wallet.name}</p>
                      <p className="text-xs text-gray-500 font-mono">
                        {formatAddress(wallet.address)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeWallet(wallet.address)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <i className="ti ti-trash"></i>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No wallets added yet</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;