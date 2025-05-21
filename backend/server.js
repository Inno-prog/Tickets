const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createServer } = require('http');
const { Server } = require('socket.io');

// Routes
const authRoutes = require('./routes/auth');
const ticketsRoutes = require('./routes/tickets');
const servicesRoutes = require('./routes/services');
const requestsRoutes = require('./routes/requests');

// Create express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sonabel_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Make db accessible to routes
app.locals.db = pool;

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketsRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/requests', requestsRoutes);

// Setup Socket.io for real-time notifications
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New client connected');
  
  // Join user to a room based on their ID
  socket.on('join', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined their room`);
  });
  
  // Handle ticket updates
  socket.on('updateTicket', async (ticketData) => {
    try {
      // Update ticket in database
      const [result] = await pool.query(
        'UPDATE tickets SET status = ?, updated_at = NOW() WHERE id = ?',
        [ticketData.status, ticketData.id]
      );
      
      // Notify all users about queue changes if necessary
      if (ticketData.status === 'unavailable') {
        // Get all tickets that need position updates
        const [tickets] = await pool.query(
          'SELECT * FROM tickets WHERE queue_date = ? AND queue_position > ? ORDER BY queue_position ASC',
          [ticketData.queueDate, ticketData.queuePosition]
        );
        
        // Update positions
        for (let i = 0; i < tickets.length; i++) {
          const ticket = tickets[i];
          const newPosition = ticket.queue_position - 1;
          
          await pool.query(
            'UPDATE tickets SET queue_position = ? WHERE id = ?',
            [newPosition, ticket.id]
          );
          
          // Notify the ticket owner
          io.to(`user_${ticket.user_id}`).emit('ticketUpdated', {
            id: ticket.id,
            queuePosition: newPosition
          });
        }
      }
      
      // Broadcast to all users that queue has been updated
      io.emit('queueUpdated');
      
      console.log(`Ticket ${ticketData.id} updated to ${ticketData.status}`);
    } catch (error) {
      console.error('Error updating ticket:', error);
    }
  });
  
  // Handle notification sending
  socket.on('sendNotification', (data) => {
    // Send to specific user if userId is provided
    if (data.userId) {
      io.to(`user_${data.userId}`).emit('notification', data.message);
    } 
    // Send to all users if it's a broadcast
    else if (data.broadcast) {
      io.emit('notification', data.message);
    }
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Une erreur est survenue sur le serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;