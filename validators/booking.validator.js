const yup = require('yup');

const { responseMessages } = require('../constants');
const { validator } = require('../helper/validator');

const addBooking = async (req, res, next) => {
  const schema = yup.object({
    body: yup.object({
      courtId: yup.string().uuid(responseMessages.ID_VALIDATION).required().label('courtId'),
      date: yup.date().typeError(responseMessages.DATE_TIME_VALIDATION).required().label('date'),
      startTime: yup
        .string()
        .required()
        .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, responseMessages.DATE_TIME_VALIDATION),
      endTime: yup
        .string()
        .required()
        .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, responseMessages.DATE_TIME_VALIDATION)
        .when('startTime', (startTime, timeSchema) => {
          return timeSchema.test({
            test: endTime => !!startTime && endTime > startTime,
            message: 'start time should be greater than end time'
          });
        })
    })
  });
  validator(req, res, schema, next);
};

const getBookingAdmin = async (req, res, next) => {
  const schema = yup.object({
    query: yup.object({
      courtId: yup.string().uuid(responseMessages.ID_VALIDATION),
      date: yup.date().typeError(responseMessages.DATE_TIME_VALIDATION)
    })
  });
  validator(req, res, schema, next);
};

module.exports = {
  addBooking,
  getBookingAdmin
};
