const { testConnection } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @desc Get Backend & Database Health Status
 * @route GET /api/health
 */
const getHealth = async (req, res) => {
  try {
    const isDbConnected = await testConnection();

    return sendSuccess(res, 'Digital Corporator API is operational', {
      service: 'Digital Corporator Backend Service',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: {
        status: isDbConnected ? 'CONNECTED' : 'DISCONNECTED',
        host: process.env.DB_HOST || 'localhost',
        name: process.env.DB_NAME || 'digital_corporator'
      }
    });
  } catch (error) {
    return sendError(res, 'Health check failed', error.message, 500);
  }
};

module.exports = {
  getHealth
};
