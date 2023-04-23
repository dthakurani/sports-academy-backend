const yup = require('yup');

const { responseMessages } = require('../constants');
const { validator } = require('../helper/validator');

const addUserSchema = async (req, res, next) => {
  const schema = yup.object({
    body: yup.object({
      name: yup.string().required(responseMessages.USERNAME_IS_REQUIRED).typeError(responseMessages.USERNAME_MUST_BE_STRING),
      email: yup.string().email(responseMessages.INVALID_EMAIL).required(responseMessages.EMAIL_IS_REQUIRED),
      password: yup
        .string()
        .required(responseMessages.PASSWORD_IS_REQUIRED)
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/, responseMessages.INVALID_PASSWORD)
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
      email: yup.string().email(responseMessages.INVALID_EMAIL).required(responseMessages.EMAIL_IS_REQUIRED),
      password: yup.string().required(responseMessages.PASSWORD_IS_REQUIRED)
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
