const { sequelize } = require('../models');
const models = require('../models');
const { customException, commonErrorHandler } = require('../helper/errorHandler');
const s3 = require('../helper/s3');

const addCourt = async (req, res, next) => {
  try {
    const { file } = req;
    const body = JSON.parse(req.body.court_details);
    const { name, description, capacity, count } = body;

    const existingCourt = await models.Court.findOne({
      where: {
        name
      }
    });
    if (existingCourt) {
      throw customException('Court already exists', 409);
    }
    if (!file) throw customException('image is required', 400);
    const fileName = name.replace(/\s+/g, '-').toLowerCase();

    const s3Upload = await s3.uploadImage(file, fileName);

    const newCourt = await models.Court.create({
      name,
      capacity,
      count,
      description,
      imageUrl: s3Upload.Location
    });

    req.data = {
      name: newCourt.name,
      imageUrl: newCourt.imageUrl,
      description: newCourt.description,
      capacity: newCourt.capacity,
      count: newCourt.count
    };

    req.statusCode = 201;
    next();
  } catch (error) {
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
      id: courtDetail.dataValues.id,
      name: courtDetail.dataValues.name,
      bookingType: courtDetail.courtDetail.dataValues.bookingType,
      capacity: courtDetail.courtDetail.dataValues.capacity,
      count: courtDetail.courtDetail.dataValues.count
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

const getAllCourts = async (req, res, next) => {
  try {
    const { page, limit } = req.query;

    let offset;
    if (page > 0) {
      offset = (page - 1) * limit;
    }

    const query = {
      limit: limit && page > 0 ? limit : null,
      offset: offset >= 0 ? offset : null,
      attributes: ['id', 'name', 'capacity', 'count', 'image_url', 'description']
    };
    const courts = await models.Court.findAll(query);
    req.data = courts;
    req.statusCode = 200;
    next();
  } catch (error) {
    console.log('get court details error: ', error);
    const statusCode = error.statusCode || 500;
    commonErrorHandler(req, res, error.message, statusCode, error);
  }
};

module.exports = {
  addCourt,
  updateCourt,
  getAllCourts
};
