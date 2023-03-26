const yup = require('yup');

const { responseMessages } = require('../constants');
const { validator } = require('../helper/validator');

const addBooking = async (req, res, next) => {
  const schema = yup.object({
    body: yup.object({
      courtId: yup.string().uuid(responseMessages.ID_VALIDATION).required(responseMessages.ID_REQUIRED),
      date: yup.date().typeError(responseMessages.DATE_TIME_VALIDATION),
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
        }),
      status: yup.string().oneOf(['successful', 'cancel', 'reject', 'pending'], responseMessages.INVALID_VALUE_FOR_STATUS)
    })
  });
  validator(req, res, schema, next);
};

module.exports = {
  addBooking
};
