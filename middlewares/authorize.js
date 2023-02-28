const { clearConfigCache } = require('prettier');
const models = require('../models');
const { customException, commonErrorHandler } = require('../helper/errorHandler');

const checkAdmin = async (req, res, next) => {
  try {
    const { user } = req;

    const isAdmin = user.role;

    if (isAdmin !== 'admin') {
      throw customException('User is not authorized.', 401);
    }

    return next();
  } catch (error) {
    console.log('User not authorized:', error);
    const statusCode = error.status || 500;
    return commonErrorHandler(req, res, error.message, statusCode, error);
  }
};

module.exports = {
  checkAdmin
};
