const yup = require('yup');
require('yup-password')(yup);

const { responseMessages } = require('../constants');
const { validator } = require('../helper/validator');

const addBooking = async (req, res, next) => {
    const schema = yup.object({
        body: yup.object({
            userId: yup.string().uuid(responseMessages.ID_VALIDATION).required(responseMessages.ID_REQUIRED),
            courtId: yup.string().uuid(responseMessages.ID_VALIDATION).required(responseMessages.ID_REQUIRED),
            date: yup.date(responseMessages.DATE_TIME_VALIDATION),
            startTime: yup.date(responseMessages.DATE_TIME_VALIDATION),
            endTime: yup.date(responseMessages.DATE_TIME_VALIDATION).when('startTime',
            (eventStartDate) => eventStartDate && schema.min(eventStartDate),
responseMessages.VALID_END_TIME),
            status: yup.string().oneOf(['successful', 'cancel', 'reject', 'pending'], responseMessages.INVALID_VALUE_FOR_STATUS)
        })
    });
    validator(req, res, schema, next);
};

module.exports = {
    addBooking
};
