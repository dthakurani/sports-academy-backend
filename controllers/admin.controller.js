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
        courtId: newCourt.id,
        bookingType,
        capacity,
        count
      },
      { transaction: t }
    );

    req.data = {
      newCourt: newCourt.name,
      bookingType: newCourtDetails.bookingType,
      capacity: newCourtDetails.capacity,
      count: newCourtDetails.count
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

const updateCourt = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { name, bookingType, capacity, count } = req.body;
    const courtId = req.params.id;

    const existingCourt = await models.Court.findOne(
      {
        where: {
          id: courtId
        }
      },
      { transaction: t }
    );

    if (!existingCourt) {
      throw customException('Court not found', 404);
    }
    if (name) {
      await models.Court.update(
        {
          name
        },
        { transaction: t }
      );
    }
    if (bookingType || capacity || count) {
      const payload = {};
      if (bookingType) payload.bookingType = bookingType;
      if (capacity) payload.capacity = capacity;
      if (count) payload.count = count;
      await models.CourtDetail.update(payload, { where: { courtId } }, { transaction: t });
    }
    await t.commit();

    const courtDetail = await models.Court.findOne({
      where: {
        id: courtId
      },
      include: 'courtDetail'
    });
    req.data = {
      id: courtDetail.id,
      name: courtDetail.name,
      bookingType: courtDetail.courtDetail.bookingType,
      capacity: courtDetail.courtDetail.capacity,
      count: courtDetail.courtDetail.count
    };
    req.statusCode = 200;
    next();
  } catch (error) {
    await t.rollback();
    console.log('addCourt error:', error);
    const statusCode = error.statusCode || 500;
    commonErrorHandler(req, res, error.message, statusCode, error);
  }
};

module.exports = {
  addCourt,
  updateCourt
};
