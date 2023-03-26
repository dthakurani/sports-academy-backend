const yup = require('yup');

const { responseMessages } = require('../constants');
const { validator } = require('../helper/validator');

const addBooking = async (req, res, next) => {
  const schema = yup.object({
    body: yup.object({
      courtId: yup.string().uuid(responseMessages.ID_VALIDATION).required(responseMessages.ID_REQUIRED),
      date: yup.date().typeError(responseMessages.DATE_TIME_VALIDATION),
      startTime: yup.string(responseMessages.DATE_TIME_VALIDATION),
      endTime: yup.string("end date can't be before start time"),
      status: yup.string().oneOf(['successful', 'cancel', 'reject', 'pending'], responseMessages.INVALID_VALUE_FOR_STATUS)
    })
  });
  validator(req, res, schema, next);
};

module.exports = {
  addBooking
};
