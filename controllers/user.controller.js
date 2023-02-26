const { hash } = require('bcrypt');
const path = require('path');
const ejs = require('ejs');

const model = require('../models');
const { customException, commonErrorHandler } = require('../helper/errorHandler');
const mailer = require('../helper/mailer');

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
    console.log('addUser error: ', error);
    const statusCode = error.statusCode || 500;
    return commonErrorHandler(req, res, error.message, statusCode, error);
  }
};

const forgetPassword = async (req, res) => {
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
    return res.status(200).send({ message: 'successful' });
  } catch (error) {
    console.log('forgetPassword error: ', error);
    const statusCode = error.statusCode || 500;
    return commonErrorHandler(req, res, error.message, statusCode, error);
  }
};

const resetPassword = async (req, res) => {
  try {
    const resetToken = req.params.token;
    console.log(resetToken);
    const { password } = req.body;

    const existingResetToken = await model.User.findOne({
      where: { resetPasswordToken: resetToken }
    });
    if (!existingResetToken) throw customException('invalid link', 404);
    const currentTime = new Date().getTime();
    if (currentTime > existingResetToken.dataValues.reset_password_expires) throw currentTime('link expired', 498);

    await model.User.update(
      { password: await hash(password, 10), resetPasswordToken: null, resetPasswordExpires: null },
      { where: { id: existingResetToken.dataValues.id } }
    );
    const templatePath = path.resolve('./templates/password-change.ejs');
    const template = await ejs.renderFile(templatePath);
    await mailer.sendMail({
      to: existingResetToken.dataValues.email,
      subject: 'Password reset successfull',
      html: template
    });
    return res.status(200).send({ message: 'successful' });
  } catch (error) {
    console.log('resetPassword error: ', error);
    const statusCode = error.statusCode || 500;
    return commonErrorHandler(req, res, error.message, statusCode, error);
  }
};

module.exports = {
  addUser,
  forgetPassword,
  resetPassword
};
