/**
 * Standard API Response Helper
 */
const sendSuccess = (res, message = 'Success', data = {}, statusCode = 200, pagination = null) => {
  const responseObj = {
    success: true,
    message,
    data
  };
  if (pagination) {
    responseObj.pagination = pagination;
  }
  return res.status(statusCode).json(responseObj);
};

const sendError = (res, message = 'An error occurred', errors = [], statusCode = 400) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors: Array.isArray(errors) ? errors : [errors]
  });
};

module.exports = {
  sendSuccess,
  sendError
};
