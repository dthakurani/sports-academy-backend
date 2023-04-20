const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const model = require('../models');

const generateToken = async userId => {
  const refreshTokenId = crypto.randomUUID();
  const accessTokenId = crypto.randomUUID();
  const body = {
    userId,
    refreshTokenId,
    accessTokenId
  };
  await model.UserAuthenticate.create(body);

  const refreshToken = jwt.sign({ userId, tokenId: refreshTokenId }, process.env.REFRESH_SECRET_KEY, {
    expiresIn: 900
  });

  const accessToken = jwt.sign({ userId, tokenId: accessTokenId }, process.env.ACCESS_SECRET_KEY, {
    expiresIn: 86400
  });

  const token = {
    refreshToken,
    accessToken
  };

  return token;
};

module.exports = {
  generateToken
};
