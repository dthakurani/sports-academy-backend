const yup = require('yup');

const { responseMessages } = require('../constants');
const { validator } = require('../helper/validator');

const addBooking = async (req, res, next) => {
  const schema = yup.object({
    body: yup.object({
      courtId: yup.string().uuid().required().label('courtId'),
      date: yup.date().typeError(responseMessages.DATE_TIME_VALIDATION).required().label('date'),
      startTime: yup
        .string()
        .matches(/^([01]?[0-9]|2[0-3]):[0][0]$/, responseMessages.DATE_TIME_VALIDATION)
        .required()
        .label('start time'),
      endTime: yup
        .string()
        .matches(/^([01]?[0-9]|2[0-3]):[0][0]$/, responseMessages.DATE_TIME_VALIDATION)
        .test('isLarger', 'end time must be larger than start time', (value, testContext) => {
          if (parseInt(testContext.parent.startTime.split(':')[0]) + 1 !== parseInt(value.split(':')[0])) return false;
          return true;
        })
        .required()
        .label('end time')
    })
  });
  validator(req, res, schema, next);
};

const cancelBooking = async (req, res, next) => {
  const schema = yup.object({
    params: yup.object({
      id: yup.string().uuid().required().label('booking id')
    })
  });
  validator(req, res, schema, next);
};

const getBookingsByCourtId = async (req, res, next) => {
  const schema = yup.object({
    params: yup.object({
      id: yup.string().uuid().required().label('court id')
    }),
    query: yup.object({
      date: yup.date().typeError(responseMessages.DATE_TIME_VALIDATION).label('date')
    })
  });
  validator(req, res, schema, next);
};

const getBookingsForAdmin = async (req, res, next) => {
  const schema = yup.object({
    query: yup.object({
      courtId: yup.string().uuid().label('court id'),
      date: yup.date().typeError(responseMessages.DATE_TIME_VALIDATION),
      status: yup.string().oneOf(['cancel', 'successful']).label('booking status')
    })
  });
  validator(req, res, schema, next);
};

const getBookingsForUser = async (req, res, next) => {
  const schema = yup.object({
    query: yup.object({
      userId: yup.string().uuid().label('user id')
    })
  });
  validator(req, res, schema, next);
};

module.exports = {
  addBooking,
  cancelBooking,
  getBookingsByCourtId,
  getBookingsForAdmin,
  getBookingsForUser
};
