const socketIO = require('socket.io');
const coingeckoService = require('../services/coingeckoService');
const alertService = require('../services/alertService');

let io;
const userSockets = new Map(); // Map userId to socketId

const initializeSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Handle user authentication for socket
    socket.on('authenticate', (token) => {
      // In production, verify JWT token here
      const userId = token; // Simplified - should decode JWT
      userSockets.set(userId, socket.id);
      socket.userId = userId;
      console.log(`User ${userId} authenticated for socket updates`);
    });

    // Handle price subscription
    socket.on('subscribePrices', async (coinIds) => {
      console.log(`Socket ${socket.id} subscribed to ${coinIds.length} coins`);

      // Send initial prices
      try {
        const prices = await coingeckoService.getPrices(coinIds);
        socket.emit('priceUpdate', prices);
      } catch (error) {
        console.error('Error sending initial prices:', error);
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      if (socket.userId) {
        userSockets.delete(socket.userId);
      }
    });
  });

  // Start price update interval (every 60 seconds)
  setInterval(async () => {
    if (io) {
      try {
        // Get all connected users and their subscribed coins
        // For simplicity, broadcast to all connected clients
        const trending = await coingeckoService.getTrending();
        const trendingIds = trending.map(coin => coin.id);

        if (trendingIds.length > 0) {
          const prices = await coingeckoService.getPrices(trendingIds.slice(0, 10));
          io.emit('priceUpdate', prices);
        }
      } catch (error) {
        console.error('Error in price update interval:', error);
      }
    }
  }, 60000); // 60 seconds

  return io;
};

// Emit alert to specific user
const emitAlert = (userId, alertData) => {
  const socketId = userSockets.get(userId);
  if (socketId && io) {
    io.to(socketId).emit('alert', alertData);
  }
};

// Emit to all users
const broadcastPriceUpdate = (prices) => {
  if (io) {
    io.emit('priceUpdate', prices);
  }
};

module.exports = {
  initializeSocket,
  emitAlert,
  broadcastPriceUpdate
};