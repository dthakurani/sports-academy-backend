const yup = require("yup");

const { responseMessages } = require("../constants");

const addUser = yup.object({
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
      .required(responseMessages.PASSWORD_IS_REQUIRED)
  }),
});

module.exports = {
    addUser
}
