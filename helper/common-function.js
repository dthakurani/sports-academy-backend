const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const model = require('../models');

const generateToken = async (userId, transaction = null) => {
  const refreshTokenId = `${crypto.randomUUID()}-${new Date().getTime()}`;
  const accessTokenId = `${crypto.randomUUID()}-${new Date().getTime()}`;

  const refreshToken = jwt.sign({ userId, tokenId: refreshTokenId }, process.env.REFRESH_SECRET_KEY, {
    expiresIn: 7776000
  });

  const accessToken = jwt.sign({ userId, tokenId: accessTokenId }, process.env.ACCESS_SECRET_KEY, {
    expiresIn: 86400
  });
  const decodeAccessToken = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);
  const refreshTokenExpireTime = decodeAccessToken.exp;
  const body = {
    userId,
    refreshTokenId,
    accessTokenId,
    refreshTokenExpireTime
  };
  await model.UserAuthenticate.create(body, { transaction });

  const token = {
    refreshToken,
    accessToken
  };

  return token;
};

module.exports = {
  generateToken
};
