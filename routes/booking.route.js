const { Router } = require('express');

const bookingValidator = require('../validators/booking.validator');
const bookingController = require('../controllers/booking.controller');
const { responseHandler } = require('../helper/generic-response');
const { checkAccessToken } = require('../middlewares/authenticate');
const { checkAdmin } = require('../middlewares/authorize');

const router = Router();

router.post('/', checkAccessToken, bookingValidator.addBooking, bookingController.addBooking, responseHandler);
router.patch('/:id', checkAccessToken, bookingValidator.updateBooking, bookingController.updateBooking, responseHandler);
router.get('/court/:id/:date', checkAccessToken, bookingValidator.getBookingsById, bookingController.getBookingsById, responseHandler);
router.get('/admin', checkAccessToken, checkAdmin, bookingValidator.getBookingAdmin, bookingController.getBooking, responseHandler);

module.exports = router;
