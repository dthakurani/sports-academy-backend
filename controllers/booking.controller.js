const { Op } = require('sequelize');
const model = require('../models');
const { customException, commonErrorHandler } = require('../helper/errorHandler');
const { sequelize } = require('../models');
const { STATUS } = require('../constants');

const addBooking = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { courtId, date, startTime, endTime } = req.body;
    const userId = req.user.id;

    const existingUser = await model.User.findOne({
      id: userId
    });
    if (!existingUser) throw customException('User not found', 404);

    const existingCourt = await model.Court.findOne({
      id: courtId
    });
    if (!existingCourt) {
      throw customException('Court not exists', 404);
    }
    const bookingExists = await model.Booking.findAll({
      where: {
        [Op.and]: [
          {
            date
          },
          {
            courtId
          },
          {
            [Op.or]: [
              {
                startTime: { [Op.between]: [startTime, endTime] }
              },
              {
                endTime: { [Op.between]: [startTime, endTime] }
              },
              {
                [Op.and]: [
                  {
                    startTime: { [Op.lt]: startTime }
                  },
                  {
                    endTime: { [Op.gt]: endTime }
                  }
                ]
              }
            ]
          }
        ]
      }
    });

    for (const booking of bookingExists) {
      if (booking.dataValues.userId === userId) {
        throw customException('booking exists for respective court and time by you.', 409);
      }
    }

    const courtDetails = await model.CourtDetail.findOne({
      courtId
    });

    if (bookingExists.length < courtDetails.dataValues.count * courtDetails.dataValues.capacity) {
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
    } else {
      throw customException('Court is not available for preferred time.', 409);
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
