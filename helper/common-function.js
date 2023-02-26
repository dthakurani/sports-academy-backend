const jwt = require('jsonwebtoken');
const config = require('../config/config');

const generateToken = async userId => {
  const refereshToken = jwt.sign({ id: userId }, config.refereshSecretKey, {
    expiresIn: 900
  });

  const accessToken = jwt.sign({ id: userId }, config.accessSecretKey, {
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
