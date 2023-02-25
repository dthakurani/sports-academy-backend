const { hash } = require('bcrypt');

const model = require('../models');
const { customException, commonErrorHandler } = require('../helper/errorHandler');

const addUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await hash(password, 10);

    const existingUser = await model.User.findOne({
      where: {
        email
      }
    });

    if (existingUser) {
      throw customException('User already exists', 409);
    }

    await model.User.create({
      name,
      email,
      password: hashedPassword
    });

    return res.status(200).send('user created successfully.');
  } catch (error) {
    console.log('getModalFieldData error: ', error);
    const statusCode = error.statusCode || 500;
    return commonErrorHandler(req, res, error.message, statusCode, error);
  }
};

module.exports = {
  addUser
};
