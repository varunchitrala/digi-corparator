const { sendError } = require('../utils/response');

/**
 * Centralized Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('[Error Middleware]', err);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  return sendError(
    res,
    message,
    process.env.NODE_ENV === 'development' ? [err.stack] : [],
    statusCode
  );
};

module.exports = errorHandler;
