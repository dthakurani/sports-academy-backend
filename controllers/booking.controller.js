/* eslint-disable no-plusplus */
const { Op } = require('sequelize');
const model = require('../models');
const { customException, commonErrorHandler } = require('../helper/errorHandler');
const { sequelize } = require('../models');
const { STATUS } = require('../constants');

const addBooking = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { userId, courtId, date, startTime, endTime } = req.body;

    const existingUser = await model.User.findOne({
      id: userId
    });
    if (!existingUser) {
      customException('User not exists', 404);
    }

    const existingCourt = await model.Court.findOne({
      id: courtId
    });
    if (!existingCourt) {
      customException('Court not exists', 404);
    }

    const bookingExists = await model.Booking.findAll({
      where: {
        startTime: {
          [Op.eq]: startTime
        },
        endTime: {
          [Op.eq]: endTime
        },
        courtId
      }
    });
    if (bookingExists) {
      for (const booking of bookingExists) {
        console.log(booking.dataValues);
      }
    }

    const courtDetails = await model.CourtDetail.findOne({
      courtId
    });
    if (!courtDetails.dataValues.capacity) {
      await model.Booking.create(
        {
          courtId,
          userId,
          date,
          startTime,
          endTime,
          status: STATUS.PENDING
        },
        { transaction: t }
      );

      await model.CourtDetail.update(
        {
          count: courtDetails.dataValues.count++
        },
        {
          where: { courtId }
        },
        { transaction: t }
      );
    } else {
      customException('Court is not available for prefered time.', 409);
    }
    req.data = {
      userId,
      courtId,
      date,
      startTime,
      endTime,
      status: 'pending'
    };

    await t.commit();
    req.statusCode = 201;
    next();
  } catch (error) {
    await t.rollback();
    console.log('create booking error:', error);
    const statusCode = error.statusCode || 500;
    commonErrorHandler(req, res, error.message, statusCode, error);
  }
};

module.exports = {
  addBooking
};
