const jwt = require('jsonwebtoken');

const models = require('../models');
const { customException, commonErrorHandler } = require('../helper/errorHandler');

const checkAccessToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const accessToken = token ? token.split(' ')[1] : null;
    if (!accessToken) {
      throw customException('Access denied', 401);
    }
    const decodedJwt = jwt.verify(accessToken, process.env.ACCESS_SECRET_KEY);
    const existingLogin = await models.UserAuthenticate.findOne({
      where: {
        userId: decodedJwt.userId,
        accessTokenId: decodedJwt.tokenId
      },
      include: 'user'
    });
    if (!existingLogin) throw customException('Please Login', 401);
    req.user = existingLogin.user.dataValues;
    next();
  } catch (error) {
    console.log('checkAccessToken error:', error);
    const statusCode = error.status || 500;
    commonErrorHandler(req, res, error.message, statusCode, error);
  }
};

const checkRefreshToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const refreshToken = token ? token.split(' ')[1] : null;
    if (!refreshToken) {
      throw customException('Access denied', 401);
    }

    const decodedJwt = jwt.verify(refreshToken, process.env.REFERESH_SECRET_KEY);

    const existingLogin = await models.UserAuthenticate.findOne({
      where: {
        userId: decodedJwt.userId,
        refreshTokenId: decodedJwt.tokenId
      }
    });

    if (!existingLogin) throw customException('Please Login', 401);

    req.user = existingLogin.dataValues;
    req.refreshToken = refreshToken;
    next();
  } catch (error) {
    console.log('checkRefreshTOken error:', error);
    const statusCode = error.statusCode || 500;
    commonErrorHandler(req, res, error.message, statusCode, error);
  }
};

module.exports = {
  checkAccessToken,
  checkRefreshToken
};
