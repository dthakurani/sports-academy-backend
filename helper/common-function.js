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

  const refereshToken = jwt.sign({ userId, tokenId: refreshTokenId }, process.env.REFERESH_SECRET_KEY, {
    expiresIn: 900
  });

  const accessToken = jwt.sign({ userId, tokenId: accessTokenId }, process.env.ACCESS_SECRET_KEY, {
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
