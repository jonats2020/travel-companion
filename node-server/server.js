const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const itinerariesRoutes = require('./routes/itineraries');
const destinationsRoutes = require('./routes/destinations');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/itineraries', itinerariesRoutes);
app.use('/api/destinations', destinationsRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Travel Planner API',
    version: '1.0.0',
    endpoints: {
      destinations: '/api/destinations',
      itineraries: '/api/itineraries',
      search: '/api/destinations/search',
    },
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});

module.exports = app;
