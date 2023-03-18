const { sequelize } = require('../models');
const models = require('../models');
const { customException, commonErrorHandler } = require('../helper/errorHandler');

const addCourt = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { name, bookingType, capacity, count } = req.body;

    const existingCourt = await models.Court.findOne(
      {
        where: {
          name
        }
      },
      { transaction: t }
    );

    if (existingCourt) {
      throw customException('Court already exists', 409);
    }

    const newCourt = await models.Court.create(
      {
        name
      },
      { transaction: t }
    );

    const newCourtDetails = await models.CourtDetail.create(
      {
        courtId: newCourt.dataValues.id,
        bookingType,
        capacity,
        count
      },
      { transaction: t }
    );

    req.data = {
      newCourt: newCourt.dataValues.name,
      bookingType: newCourtDetails.dataValues.bookingType,
      capacity: newCourtDetails.dataValues.capacity,
      count: newCourtDetails.dataValues.count
    };
    await t.commit();
    req.statusCode = 201;
    next();
  } catch (error) {
    await t.rollback();
    console.log('addCourt error:', error);
    const statusCode = error.statusCode || 500;
    commonErrorHandler(req, res, error.message, statusCode, error);
  }
};

module.exports = {
  addCourt
};
