const model = require('../models');
const { customException, commonErrorHandler } = require('../helper/errorHandler');
const { STATUS } = require('../constants');

const addBooking = async (req, res, next) => {
  try {
    const { courtId, date, startTime, endTime } = req.body;
    const userId = req.user.id;

    const existingUser = await model.User.findOne({
      where: {
        id: userId
      }
    });
    if (!existingUser) throw customException('User not found', 404);

    const existingCourt = await model.Court.findOne({
      where: {
        id: courtId
      }
    });
    if (!existingCourt) {
      throw customException('Court not exists', 404);
    }

    const todayDate = new Date();
    if (date < todayDate.toISOString().slice(0, 10)) {
      throw customException('Valid date is required', 400);
    }

    const beginTime = startTime.split(':');
    const finishTime = endTime.split(':');

    if (
      startTime < todayDate.toTimeString().slice(0, 8) ||
      beginTime[1] !== '00' ||
      finishTime[1] !== '00' ||
      parseInt(beginTime[0]) + 1 !== parseInt(finishTime[0]) ||
      (beginTime[0] < '6' && finishTime[0] > '23')
    ) {
      throw customException('Valid time is required', 400);
    }
    const whereQuery = {
      date,
      courtId,
      startTime,
      endTime
    };
    const bookingExists = await model.Booking.findAll({
      where: whereQuery
    });

    for (const booking of bookingExists) {
      if (booking.userId === userId) {
        throw customException('booking exists for respective court and time by you.', 409);
      }
    }

    if (bookingExists.length < existingCourt.count * existingCourt.capacity) {
      await model.Booking.create({
        courtId,
        userId,
        date,
        startTime,
        endTime,
        status: STATUS.PENDING
      });
    } else {
      throw customException('Court is not available for preferred time.', 409);
    }

    const courtDetails = await model.Court.findOne({
      id: courtId
    });

    req.data = {
      userId,
      courtName: courtDetails.name,
      date,
      startTime,
      endTime,
      status: 'pending'
    };

    req.statusCode = 201;
    next();
  } catch (error) {
    console.log('create booking error:', error);
    const statusCode = error.statusCode || 500;
    commonErrorHandler(req, res, error.message, statusCode, error);
  }
};

const updateBooking = async (req, res, next) => {
  try {
    const { date, startTime, endTime, status } = req.body;
    const userId = req.user.id;
    const bookingId = req.params.id;

    const existingBooking = await model.Booking.findOne({
      where: {
        id: bookingId,
        userId
      },
      include: {
        model: model.Court,
        as: 'court'
      }
    });
    if (!existingBooking) throw customException('Booking not found', 404);

    const todayDate = new Date();
    if (date || existingBooking.date) {
      const bookingDate = date || existingBooking.date;
      if (bookingDate < todayDate.toISOString().slice(0, 10)) {
        throw customException('action can not be performed', 400);
      }
    }
    if ((startTime && endTime) || (existingBooking.startTime && existingBooking.endTime)) {
      const bookingStartTime = startTime || existingBooking.startTime;
      const bookingEndTime = endTime || existingBooking.endTime;
      const beginTime = bookingStartTime.split(':');
      const finishTime = bookingEndTime.split(':');
      console.log(bookingStartTime, `${todayDate.getHours()}:${todayDate.getMinutes()}`);
      if (
        bookingStartTime < todayDate.toTimeString().slice(0, 8) ||
        beginTime[1] !== '00' ||
        finishTime[1] !== '00' ||
        parseInt(beginTime[0]) + 1 !== parseInt(finishTime[0]) ||
        (beginTime[0] < '6' && finishTime[0] > '23')
      ) {
        throw customException('action can not be performed', 400);
      }
    }

    const whereQuery = {
      id: bookingId,
      date: date || null,
      startTime: startTime || null,
      endTime: endTime || null
    };
    const bookingExists = await model.Booking.findAll({
      where: whereQuery
    });

    for (const booking of bookingExists) {
      if (booking.userId === userId) {
        throw customException('booking exists for respective court and time by you.', 409);
      }
    }

    if (bookingExists.length < existingBooking.court.count * existingBooking.court.capacity) {
      if ((startTime && endTime) || date) {
        req.body.status = 'pending';
      }
      await model.Booking.update(req.body, { where: { id: bookingId } });
    } else {
      throw customException('Court is not available for preferred time.', 409);
    }

    const updateBookingResponse = {
      bookingId,
      courtName: existingBooking.court.name,
      date: date || existingBooking.date,
      startTime: startTime || existingBooking.startTime,
      endTime: endTime || existingBooking.endTime,
      status: status || 'pending'
    };

    req.data = updateBookingResponse;

    next();
  } catch (error) {
    console.log('updateBooking error:', error);
    const statusCode = error.statusCode || 500;
    commonErrorHandler(req, res, error.message, statusCode, error);
  }
};

module.exports = {
  addBooking,
  updateBooking
};
