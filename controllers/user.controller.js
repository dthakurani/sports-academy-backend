const bcrypt = require('bcrypt');
const path = require('path');
const ejs = require('ejs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const model = require('../models');
const { customException, commonErrorHandler } = require('../helper/errorHandler');
const { generateToken } = require('../helper/common-function');
const { mailer } = require('../helper/mailer');
const { sequelize } = require('../models');

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
    console.log('addUser error: ', error);
    const statusCode = error.statusCode || 500;
    commonErrorHandler(req, res, error.message, statusCode, error);
  }
};

const forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await model.User.findOne({
      where: {
        email
      }
    });
    if (!user) throw customException('User Not Found', 404);
    const randomToken = crypto.randomUUID();
    const resetPassawordLink = `${process.env.BASE_URL}/api/user/reset-password/${randomToken}`;
    let resetPassawordLinkExpires = new Date();
    resetPassawordLinkExpires = resetPassawordLinkExpires.setMinutes(resetPassawordLinkExpires.getMinutes() + 15);
    await model.User.update(
      {
        resetPasswordToken: randomToken,
        resetPasswordExpires: resetPassawordLinkExpires
      },
      { where: { id: user.dataValues.id } }
    );
    const templatePath = path.resolve('./templates/reset-password.ejs');
    const template = await ejs.renderFile(templatePath, { reset_password_link: resetPassawordLink });
    await mailer.sendMail({
      to: user.dataValues.email,
      subject: 'Reset password',
      html: template
    });
    req.statusCode = 200;
    req.data = {
      message: 'Link for reset password sent to your email.'
    };
    next();
  } catch (error) {
    console.log('forgetPassword error: ', error);
    const statusCode = error.statusCode || 500;
    commonErrorHandler(req, res, error.message, statusCode, error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const resetToken = req.params.token;

    const { password } = req.body;

    const existingResetToken = await model.User.findOne({
      where: { resetPasswordToken: resetToken }
    });
    if (!existingResetToken) throw customException('invalid link', 404);
    const currentTime = new Date().getTime();
    if (currentTime > existingResetToken.dataValues.reset_password_expires) throw customException('link expired', 498);

    await model.User.update(
      { password: await bcrypt.hash(password, 10), resetPasswordToken: null, resetPasswordExpires: null },
      { where: { id: existingResetToken.dataValues.id } }
    );
    const templatePath = path.resolve('./templates/password-change.ejs');
    const template = await ejs.renderFile(templatePath);
    await mailer.sendMail({
      to: existingResetToken.dataValues.email,
      subject: 'Password reset successfull',
      html: template
    });
    req.statusCode = 200;
    req.data = {
      message: 'Password reset successfully.'
    };
    next();
  } catch (error) {
    console.log('resetPassword error: ', error);
    const statusCode = error.statusCode || 500;
    commonErrorHandler(req, res, error.message, statusCode, error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existingUser = await model.User.findOne({
      where: {
        email
      }
    });
    if (!existingUser) {
      throw customException('Email or Password is incorrect.', 401);
    }

    const passwordIsValid = await bcrypt.compare(password, existingUser.password);

    if (!passwordIsValid) {
      throw customException('Email or Password is incorrect.', 401);
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
    console.log('loginUser error:', error);
    const statusCode = error.status || 500;
    commonErrorHandler(req, res, error.message, statusCode, error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { body, user } = req;
    const existingUser = await model.User.findOne({
      where: {
        id: user.id
      }
    });

    if (!existingUser) throw customException('User not found', 404);

    await model.User.update(body, {
      where: {
        id: user.id
      }
    });

    req.data = {
      id: user.id,
      name: body.name || user.name,
      email: body.email || user.email
    };
    next();
  } catch (error) {
    console.log('updateUser error:', error);
    const statusCode = error.status || 500;
    commonErrorHandler(req, res, error.message, statusCode, error);
  }
};

const generateAccessToken = async (req, res, next) => {
  try {
    const { user } = req;

    const accessToken = crypto.randomUUID();

    await model.UserAuthenticate.update(
      {
        accessTokenId: accessToken
      },
      {
        where: { refreshTokenId: user.refreshTokenId }
      }
    );

    const newAccessToken = jwt.sign({ userId: user.userId, tokenId: accessToken }, process.env.ACCESS_SECRET_KEY);

    req.data = {
      accessToken: newAccessToken,
      refreshToken: req.refreshToken
    };
    next();
  } catch (error) {
    console.log('generate access token error: ', error);
    const statusCode = error.statusCode || 500;
    commonErrorHandler(req, res, error.message, statusCode, error);
  }
};

const deleteUser = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { userId, refreshTokenId } = req.user;
    await model.UserAuthenticate.destroy({
      where: {
        userId,
        refreshTokenId
      },
      transaction
    });
    await model.User.destroy({
      where: {
        id: userId
      },
      transaction
    });
    await transaction.commit();
    req.statusCode = 204;
    next();
  } catch (error) {
    await transaction.rollback();
    console.log('userDelete error: ', error);
  }
};

const logoutUser = async (req, res, next) => {
  try {
    const { user } = req;

    await model.UserAuthenticate.destroy({
      where: {
        userId: user.userId,
        refreshTokenId: user.refreshTokenId
      }
    });
    req.statusCode = 204;

    next();
  } catch (error) {
    console.log('error in logout: ', error);
    const statusCode = error.statusCode || 500;
    commonErrorHandler(req, res, error.message, statusCode, error);
  }
};

module.exports = {
  addUser,
  loginUser,
  forgetPassword,
  resetPassword,
  updateUser,
  generateAccessToken,
  deleteUser,
  logoutUser
};
