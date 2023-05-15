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
        })
    })
  });
  validator(req, res, schema, next);
};

const updateBooking = async (req, res, next) => {
  const schema = yup.object({
    params: yup.object({
      id: yup.string().uuid().required().label('booking id')
    }),
    body: yup.object({
      date: yup.date().typeError(responseMessages.DATE_TIME_VALIDATION).label('date'),
      status: yup.string().oneOf(['cancel']).label('booking status'),
      startTime: yup
        .string()
        .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, responseMessages.DATE_TIME_VALIDATION)
        .nullable()
        .label('start time'),
      endTime: yup
        .string()
        .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, responseMessages.DATE_TIME_VALIDATION)
        .test('isLarger', 'end time must be larger than start time', (value, testContext) => {
          if (testContext.parent.startTime > value) return false;
          return true;
        })
        .label('end time')
    })
  });
  validator(req, res, schema, next);
};

module.exports = {
  addBooking,
  updateBooking
};
