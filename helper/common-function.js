const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const model = require('../models');

const generateToken = async userId => {
  const refreshTokenId = crypto.randomUUID();
  const accessTokenId = crypto.randomUUID();

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
  await model.UserAuthenticate.create(body);

  const token = {
    refreshToken,
    accessToken
  };

  return token;
};

module.exports = {
  generateToken
};
