const jwt = require('jsonwebtoken');

const config = require('../config/config');
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

  const refereshToken = jwt.sign({ userId, tokenId: refreshTokenId }, config.refereshSecretKey, {
    expiresIn: 900
  });

  const accessToken = jwt.sign({ userId, tokenId: accessTokenId }, config.accessSecretKey, {
    expiresIn: 86400
  });

  const token = {
    refereshToken,
    accessToken
  };

  return token;
};

module.exports = {
  generateToken
};
