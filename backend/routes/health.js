const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// @route   GET /api/health
// @desc    Health check endpoint for deployment monitoring
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Check database connection
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    // Basic health check
    const healthCheck = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      memory: process.memoryUsage(),
      platform: process.platform,
      nodeVersion: process.version,
      database: {
        status: dbStatus,
        readyState: mongoose.connection.readyState
      }
    };

    res.status(200).json(healthCheck);
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

module.exports = router; 