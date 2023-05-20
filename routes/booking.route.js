const { Router } = require('express');

const bookingValidator = require('../validators/booking.validator');
const bookingController = require('../controllers/booking.controller');
const { responseHandler } = require('../helper/generic-response');
const { checkAccessToken } = require('../middlewares/authenticate');
const { checkAdmin } = require('../middlewares/authorize');

const router = Router();

router.post('/', checkAccessToken, bookingValidator.addBooking, bookingController.addBooking, responseHandler);
router.delete('/:id', checkAccessToken, bookingValidator.cancelBooking, bookingController.cancelBooking, responseHandler);
router.get('/court/:id', checkAccessToken, bookingValidator.getBookingsByCourtId, bookingController.getBookingsByCourtId, responseHandler);
router.get('/admin', checkAccessToken, checkAdmin, bookingValidator.getBookingsForAdmin, bookingController.getBookingsForAdmin, responseHandler);
router.get('/user', checkAccessToken, bookingValidator.getBookingsForUser, bookingController.getBookingsForUser, responseHandler);

module.exports = router;
