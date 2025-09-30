const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Import routes
const customerRoutes = require('./routes/customer');
const roomRoutes = require('./routes/room');
const bookingRoutes = require('./routes/booking');
const serviceRoutes = require('./routes/service');
const invoiceRoutes = require('./routes/invoice');
const staffRoutes = require('./routes/staff');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/customers', customerRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/staff', staffRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Hotel Management API is running' });
});

// Default route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Hotel Management API',
    version: '1.0.0',
    endpoints: [
      '/api/customers',
      '/api/rooms', 
      '/api/bookings',
      '/api/services',
      '/api/invoices',
      '/api/staff'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Hotel Management API server is running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📖 API docs: http://localhost:${PORT}/`);
});

module.exports = app;