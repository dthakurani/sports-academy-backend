const yup = require('yup');

const { responseMessages } = require('../constants');
const { validator } = require('../helper/validator');

const addUserSchema = async (req, res, next) => {
  const schema = yup.object({
    body: yup.object({
      email: yup.string().email().required().label('email'),
      password: yup
        .string()
        .required()
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/, responseMessages.INVALID_PASSWORD),
      name: yup
        .string()
        .matches(/^[A-Za-z\s]+$/, responseMessages.INVALID_USERNAME)
        .required()
        .label('name')
    })
  });
  validator(req, res, schema, next);
};

const forgetPasswordSchema = async (req, res, next) => {
  const schema = yup.object({
    body: yup.object({
      email: yup.string().email(responseMessages.INVALID_EMAIL).required(responseMessages.EMAIL_IS_REQUIRED)
    })
  });
  validator(req, res, schema, next);
};

const resetPasswordSchema = async (req, res, next) => {
  const schema = yup.object({
    body: yup.object({
      password: yup.string().password(responseMessages.INVALID_PASSWORD).required(responseMessages.PASSWORD_IS_REQUIRED)
    }),
    params: yup.object({
      token: yup.string().uuid().required(responseMessages.TOKEN_IS_REQUIRED)
    })
  });
  validator(req, res, schema, next);
};

const loginUserSchema = async (req, res, next) => {
  const schema = yup.object({
    body: yup.object({
      email: yup.string().email().required().label('email'),
      password: yup.string().required().label('password')
    })
  });
  validator(req, res, schema, next);
};

const updateUserSchema = async (req, res, next) => {
  const schema = yup.object({
    body: yup.object({
      name: yup.string().typeError(responseMessages.USERNAME_MUST_BE_STRING),
      email: yup.string().email(responseMessages.INVALID_EMAIL)
    })
  });
  validator(req, res, schema, next);
};

module.exports = {
  addUserSchema,
  forgetPasswordSchema,
  resetPasswordSchema,
  loginUserSchema,
  updateUserSchema
};
