const bcrypt = require('bcrypt');

const model = require('../models');
const { customException, commonErrorHandler } = require('../helper/errorHandler');
const { generateToken } = require('../helper/common-function');

// eslint-disable-next-line consistent-return
const addUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await model.User.findOne({
      where: {
        email
      }
    });

    if (existingUser) {
      throw customException('User already exists', 409);
    }

    const newUser = await model.User.create({
      name,
      email,
      password: hashedPassword
    });
    const tokens = await generateToken(newUser.dataValues.id);
    req.statusCode = 201;
    req.data = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      tokens
    };
    next();
  } catch (error) {
    console.log('getModalFieldData error: ', error);
    const statusCode = error.statusCode || 500;
    return commonErrorHandler(req, res, error.message, statusCode, error);
  }
};

// eslint-disable-next-line consistent-return
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existingUser = await model.User.findOne({
      where: {
        email
      }
    });
    if (!existingUser) {
      throw customException('Email or Password is incorrect.', 404);
    }

    const passwordIsValid = await bcrypt.compare(password, existingUser.password);

    if (!passwordIsValid) {
      throw customException('Email or Password is incorrect.', 404);
    }

    const tokens = await generateToken(existingUser.dataValues.id);

    req.statusCode = 200;
    req.data = {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      tokens
    };
    next();
  } catch (error) {
    console.log('getModelFieldData error:', error);
    const statusCode = error.status || 500;
    return commonErrorHandler(req, res, error.message, statusCode, error);
  }
};

module.exports = {
  addUser,
  loginUser
};
