/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import apiClient from '../api/axios';
import toast from 'react-hot-toast';

const PortfolioContext = createContext({});

export const usePortfolio = () => useContext(PortfolioContext);

export const PortfolioProvider = ({ children }) => {
  const [portfolio, setPortfolio] = useState(null);
  const [prices, setPrices] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);

  // Initialize socket connection
  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    const newSocket = io(socketUrl);

    newSocket.on('connect', () => {
      console.log('Socket connected');
      const token = localStorage.getItem('token');
      if (token) {
        newSocket.emit('authenticate', token);
      }
    });

    newSocket.on('priceUpdate', (data) => {
      setPrices(prev => ({ ...prev, ...data }));
    });

    newSocket.on('alert', (alertData) => {
      toast.success(
        `Alert triggered! ${alertData.data.coinSymbol} is ${alertData.data.condition} ${alertData.data.alertPrice}`,
        { duration: 6000 }
      );
      fetchAlerts(); // Refresh alerts list
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Subscribe to price updates for portfolio coins
  useEffect(() => {
    if (socket && portfolio?.holdings) {
      const coinIds = portfolio.holdings.map(h => h.coinId);
      if (coinIds.length > 0) {
        socket.emit('subscribePrices', coinIds);
      }
    }
  }, [socket, portfolio]);

  const fetchPortfolio = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/portfolio');
      setPortfolio(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      toast.error('Failed to load portfolio');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAlerts = useCallback(async () => {
    try {
      const response = await apiClient.get('/alerts');
      setAlerts(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching alerts:', error);
      return [];
    }
  }, []);

  const addHolding = async (holdingData) => {
    try {
      const response = await apiClient.post('/portfolio', holdingData);
      toast.success('Holding added successfully');
      await fetchPortfolio(); // Refresh portfolio
      return { success: true, data: response.data };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add holding');
      return { success: false, error: error.response?.data?.message };
    }
  };

  const updateHolding = async (id, updates) => {
    try {
      const response = await apiClient.put(`/portfolio/${id}`, updates);
      toast.success('Holding updated successfully');
      await fetchPortfolio(); // Refresh portfolio
      return { success: true, data: response.data };
    } catch (error) {
      toast.error('Failed to update holding');
      return { success: false };
    }
  };

  const deleteHolding = async (id) => {
    try {
      await apiClient.delete(`/portfolio/${id}`);
      toast.success('Holding deleted successfully');
      await fetchPortfolio(); // Refresh portfolio
      return { success: true };
    } catch (error) {
      toast.error('Failed to delete holding');
      return { success: false };
    }
  };

  const createAlert = async (alertData) => {
    try {
      const response = await apiClient.post('/alerts', alertData);
      toast.success('Alert created successfully');
      await fetchAlerts(); // Refresh alerts
      return { success: true, data: response.data };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create alert');
      return { success: false, error: error.response?.data?.message };
    }
  };

  const toggleAlert = async (id, isActive) => {
    try {
      const response = await apiClient.patch(`/alerts/${id}/toggle`, { isActive });
      setAlerts(prev => prev.map(alert =>
        alert._id === id ? { ...alert, isActive } : alert
      ));
      toast.success(`Alert ${isActive ? 'enabled' : 'disabled'}`);
      return { success: true, data: response.data };
    } catch (error) {
      toast.error('Failed to update alert');
      return { success: false };
    }
  };

  const deleteAlert = async (id) => {
    try {
      await apiClient.delete(`/alerts/${id}`);
      toast.success('Alert deleted successfully');
      setAlerts(prev => prev.filter(alert => alert._id !== id));
      return { success: true };
    } catch (error) {
      toast.error('Failed to delete alert');
      return { success: false };
    }
  };

  const getPortfolioChartData = async (days = '30') => {
    try {
      const response = await apiClient.get(`/portfolio/chart/data?days=${days}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching chart data:', error);
      return { timestamps: [], values: [] };
    }
  };

  // Load portfolio and alerts on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchPortfolio();
      fetchAlerts();
    }
  }, [fetchPortfolio, fetchAlerts]);

  const value = {
    portfolio,
    prices,
    alerts,
    loading,
    socket,
    fetchPortfolio,
    addHolding,
    updateHolding,
    deleteHolding,
    createAlert,
    toggleAlert,
    deleteAlert,
    getPortfolioChartData,
    fetchAlerts
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
};