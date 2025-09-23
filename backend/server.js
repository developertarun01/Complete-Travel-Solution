const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const travelRoutes = require('./routes/travel');
const bookingRoutes = require('./routes/booking');
const paymentRoutes = require('./routes/payment');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration - simplified for Vercel
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://complete-travel-solution.vercel.app'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/travel-booking', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    console.log('Note: Application will continue but booking data will not be persisted');
  });

// Routes
app.use('/api/travel', travelRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/payment', paymentRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running successfully',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Error handling middleware
app.use(require('./middleware/errorHandler'));

// Handle 404 routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);

  // Check if Amadeus API keys are configured
  if (!process.env.AMADEUS_API_KEY || !process.env.AMADEUS_API_SECRET) {
    console.log('Note: Amadeus API keys not configured. Using mock data for travel search.');
  }
});

module.exports = app;