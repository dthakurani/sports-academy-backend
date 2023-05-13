const { Op } = require('sequelize');
const model = require('../models');
const { customException, commonErrorHandler } = require('../helper/errorHandler');
const { sequelize } = require('../models');
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

module.exports = {
  addBooking
};
