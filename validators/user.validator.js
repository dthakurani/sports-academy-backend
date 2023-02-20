const yup = require("yup");
require("yup-password")(yup);

const { responseMessages } = require("../constants");
const {validator} = require('../helper/errorHandler');

const addUser = async(req, res, next) => {
    const schema = yup.object({
    body: yup.object({
      name: yup
        .string()
        .required(responseMessages.USERNAME_IS_REQUIRED)
        .typeError(responseMessages.USERNAME_MUST_BE_STRING),
      email: yup
        .string()
        .email(responseMessages.INVALID_EMAIL)
        .required(responseMessages.EMAIL_IS_REQUIRED),
      password: yup
        .string()
        .password(responseMessages.INVALID_PASSWORD)
        .required(responseMessages.PASSWORD_IS_REQUIRED),
    }),
  });
validator(req, res, schema, next);
}

module.exports = {
  addUser,
};
