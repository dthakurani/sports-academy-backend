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

const getBookingsById = async (req, res, next) => {
  try {
    const courtId = req.params.id;
    const { date } = req.params;
    const existingBookings = await model.Booking.findAll({
      where: {
        date,
        courtId,
        status: 'successful'
      },
      attribute: ['startTime', 'endTime'],
      include: {
        model: model.Court,
        as: 'court',
        attributes: ['id'],
        where: {
          id: courtId
        }
      }
    });
    if (!existingBookings) throw customException('court not found', 404);
    const bookings = [];
    existingBookings.forEach(booking => {
      bookings.push([booking.startTime, booking.endTime]);
    });
    req.data = {
      bookings
    };
    next();
  } catch (error) {
    console.log('getCourtDetails error: ', error);
    const statusCode = error.statusCode || 500;
    commonErrorHandler(req, res, error.message, statusCode, error);
  }
};

const getBooking = async (req, res, next) => {
  try {
    const { courtId, date } = req.query;

    const filter = {};
    if (courtId) filter.courtId = courtId;
    if (date) filter.date = date;

    const bookings = await model.Booking.findAll({
      where: filter,
      attributes: ['courtId', 'userId', 'date', 'startTime', 'endTime', 'status']
    });

    req.data = bookings;
    req.statusCode = 200;
    next();
  } catch (error) {
    console.log('get booking error:', error);
    const statusCode = error.statusCode || 500;
    commonErrorHandler(req, res, error.message, statusCode, error);
  }
};

const userBookingsByUserId = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const allBookingsOfUser = await model.Booking.findAll({
      where: {
        userId
      },
      attributes: ['id', 'date', 'startTime', 'endTime', 'status'],
      include: [
        {
          model: model.Court,
          as: 'court',
          attributes: ['id', 'name']
        },
        {
          model: model.User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ]
    });
    const userCourtDetailsWithBookings = {
      user: {
        id: allBookingsOfUser[0].user.id,
        name: allBookingsOfUser[0].user.name,
        email: allBookingsOfUser[0].user.email
      },
      court: {
        id: allBookingsOfUser[0].court.id,
        name: allBookingsOfUser[0].court.name
      }
    };
    const bookings = [];
    allBookingsOfUser.forEach(booking => {
      bookings.push({
        id: booking.id,
        data: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
        status: booking.status
      });
    });
    userCourtDetailsWithBookings.bookings = bookings;
    req.data = userCourtDetailsWithBookings;
    next();
  } catch (error) {
    console.log('userBookingsByUserId error:', error);
    const statusCode = error.statusCode || 500;
    commonErrorHandler(req, res, error.message, statusCode, error);
  }
};

module.exports = {
  addBooking,
  updateBooking,
  getBookingsById,
  getBooking,
  userBookingsByUserId
};
