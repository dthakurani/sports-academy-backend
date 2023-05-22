const { Op, Sequelize } = require('sequelize');

const model = require('../models');
const { customException, commonErrorHandler } = require('../helper/errorHandler');

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
    const currentDate = todayDate.toISOString().slice(0, 10);
    const currentHour = todayDate.getHours();
    if (date < currentDate) {
      throw customException('Valid date is required', 400);
    }

    const beginTime = startTime.split(':');
    const finishTime = endTime.split(':');

    if ((beginTime[0] < currentHour && date < currentDate) || (beginTime[0] < '6' && finishTime[0] > '23')) {
      throw customException('Valid time is required', 400);
    }
    const whereQuery = {
      date,
      courtId,
      startTime,
      endTime,
      status: 'successful'
    };
    const bookingExists = await model.Booking.findAll({
      where: whereQuery
    });

    let booking = {};
    if (bookingExists.length < existingCourt.count * existingCourt.capacity) {
      booking = await model.Booking.create({
        courtId,
        userId,
        date,
        startTime,
        endTime,
        status: 'successful'
      });
    } else {
      throw customException('Court is not available for preferred time.', 409);
    }

    const courtDetails = await model.Court.findOne({
      where: { id: courtId }
    });

    req.data = {
      bookingId: booking.id,
      courtName: courtDetails.name,
      date,
      startTime,
      endTime,
      status: 'successful'
    };

    req.statusCode = 201;
    next();
  } catch (error) {
    console.log('create booking error:', error);
    const statusCode = error.statusCode || 500;
    commonErrorHandler(req, res, error.message, statusCode, error);
  }
};

const cancelBooking = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const bookingId = req.params.id;

    const todayDate = new Date();
    const currentDate = todayDate.toISOString().slice(0, 10);
    const currentHour = todayDate.getHours();

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

    if (existingBooking.status === 'cancel') throw customException('Action already performed', 498);

    const bookingStartTime = existingBooking.startTime.split(':')[0];
    if (existingBooking.date < currentDate || (existingBooking.date === currentDate && bookingStartTime <= currentHour)) {
      throw customException('action can not be performed', 400);
    }

    await model.Booking.update({ status: 'cancel' }, { where: { id: bookingId } });

    const updateBookingResponse = {
      bookingId,
      courtName: existingBooking.court.name,
      date: existingBooking.date,
      startTime: existingBooking.startTime,
      endTime: existingBooking.endTime,
      status: 'cancel'
    };

    req.data = updateBookingResponse;

    next();
  } catch (error) {
    console.log('updateBooking error:', error);
    const statusCode = error.statusCode || 500;
    commonErrorHandler(req, res, error.message, statusCode, error);
  }
};

const getBookingsByCourtId = async (req, res, next) => {
  try {
    const courtId = req.params.id;
    const { date } = req.query;
    const today = new Date();
    const currentDate = today.toISOString().slice(0, 10);
    let existingCourt;
    let getBookingsByCourtIdResponse;
    const whereQuery = {
      date: date || currentDate,
      status: 'successful'
    };
    if (!date) {
      existingCourt = await model.Court.findOne({
        where: {
          id: courtId
        },
        attributes: ['id', 'name', 'imageUrl', 'description', 'count']
      });
      getBookingsByCourtIdResponse = {
        id: existingCourt.id,
        name: existingCourt.name,
        count: existingCourt.count,
        imageUrl: existingCourt.imageUrl,
        description: existingCourt.description
      };
    }
    if (!date || date === currentDate) {
      whereQuery.startTime = { [Op.gte]: `${today.getHours() + 1}:00:00` };
    }

    const existingBookings = await model.Booking.findAll({
      attributes: ['startTime', 'endTime'],
      where: whereQuery,
      include: {
        model: model.Court,
        as: 'court',
        attributes: [],
        where: {
          id: courtId
        }
      },
      group: ['Booking.start_time', 'Booking.end_time', 'court.count', 'court.capacity'],
      having: Sequelize.literal('COUNT(*) >= (court.count*court.capacity)'),
      order: [Sequelize.col('startTime')]
    });

    if (!existingBookings) throw customException('court not found', 404);
    const bookings = [];
    existingBookings.forEach(booking => {
      bookings.push([booking.startTime, booking.endTime]);
    });

    req.data = {
      ...getBookingsByCourtIdResponse,
      bookings
    };
    next();
  } catch (error) {
    console.log('getCourtDetails error: ', error);
    const statusCode = error.statusCode || 500;
    commonErrorHandler(req, res, error.message, statusCode, error);
  }
};

const getBookingsForAdmin = async (req, res, next) => {
  try {
    const { courtId, date, status } = req.query;

    const filter = {};
    if (courtId) filter.courtId = courtId;
    if (date) filter.date = date;
    if (status) filter.status = status;

    const bookings = await model.Booking.findAll({
      where: filter,
      attributes: ['id', 'date', 'startTime', 'endTime', 'status'],
      order: [
        ['date', 'ASC'],
        ['startTime', 'ASC']
      ],
      include: [
        {
          model: model.User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        },
        {
          model: model.Court,
          as: 'court',
          attributes: ['id', 'name']
        }
      ]
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

const getBookingsForUser = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const existingBookings = await model.Booking.findAll({
      where: {
        userId
      },
      include: {
        model: model.Court,
        as: 'court',
        attributes: ['name', 'imageUrl']
      },
      attributes: ['id', 'date', 'startTime', 'endTime', 'status'],
      order: [['createdAt', 'DESC']]
    });

    if (!existingBookings) throw customException('User not found', 404);

    req.data = existingBookings;
    req.statusCode = 200;
    next();
  } catch (error) {
    console.log('get booking error:', error);
    const statusCode = error.statusCode || 500;
    commonErrorHandler(req, res, error.message, statusCode, error);
  }
};

module.exports = {
  addBooking,
  cancelBooking,
  getBookingsByCourtId,
  getBookingsForAdmin,
  getBookingsForUser
};
