const yup = require('yup');
require('yup-password')(yup);

const { responseMessages } = require('../constants');
const { validator } = require('../helper/validator');

const addCourt = async (req, res, next) => {
  const schema = yup.object({
    body: yup.object({
      name: yup.string().typeError(responseMessages.COURT_NAME_MUST_BE_STRING).required().label('court name'),
      capacity: yup
        .number()
        .typeError(responseMessages.INVALID_VALUE_FOR_NUMBER)
        .integer(responseMessages.INVALID_VALUE_FOR_POSITIVE_INTEGER)
        .positive(responseMessages.INVALID_VALUE_FOR_POSITIVE_INTEGER)
        .nullable(true),
      count: yup
        .number()
        .typeError(responseMessages.INVALID_VALUE_FOR_NUMBER)
        .integer(responseMessages.INVALID_VALUE_FOR_POSITIVE_INTEGER)
        .positive(responseMessages.INVALID_VALUE_FOR_POSITIVE_INTEGER)
        .nullable(true)
    }),
    description: yup.object().required().label('description')
  });
  validator(req, res, schema, next);
};

const updateCourt = async (req, res, next) => {
  const schema = yup.object({
    params: yup.object({
      id: yup.string().uuid(responseMessages.ID_VALIDATION).required(responseMessages.ID_REQUIRED)
    }),
    body: yup.object({
      name: yup.string().typeError(responseMessages.COURT_NAME_MUST_BE_STRING),
      bookingType: yup.string().oneOf(['single', 'multiple'], responseMessages.INVALID_VALUE_FOR_BOOKING_TYPE),
      capacity: yup
        .number()
        .typeError(responseMessages.INVALID_VALUE_FOR_NUMBER)
        .integer(responseMessages.INVALID_VALUE_FOR_POSITIVE_INTEGER)
        .positive(responseMessages.INVALID_VALUE_FOR_POSITIVE_INTEGER),
      count: yup
        .number()
        .typeError(responseMessages.INVALID_VALUE_FOR_NUMBER)
        .integer(responseMessages.INVALID_VALUE_FOR_POSITIVE_INTEGER)
        .positive(responseMessages.INVALID_VALUE_FOR_POSITIVE_INTEGER)
    })
  });
  validator(req, res, schema, next);
};

const getCourt = async (req, res, next) => {
  const schema = yup.object({
    query: yup.object({
      limit: yup.number().typeError(responseMessages.INVALID_VALUE_FOR_NUMBER).optional().default(10),
      page: yup.number().typeError(responseMessages.INVALID_VALUE_FOR_NUMBER).required(responseMessages.VALID_PAGE_NUMBER_IS_REQUIRED).optional().default(0)
    })
  });
  validator(req, res, schema, next);
};

module.exports = {
  addCourt,
  updateCourt,
  getCourt
};
