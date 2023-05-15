const { sequelize } = require('../models');
const model = require('../models');
const { customException, commonErrorHandler } = require('../helper/errorHandler');
const s3 = require('../helper/s3');

const addCourt = async (req, res, next) => {
  try {
    const { file } = req;
    const body = JSON.parse(req.body.court_details);
    const { name, description, capacity, count } = body;

    const existingCourt = await model.Court.findOne({
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

    const newCourt = await model.Court.create({
      name,
      capacity,
      count,
      description,
      imageUrl: s3Upload.Location
    });

    req.data = {
      id: newCourt.id,
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

    const existingCourt = await model.Court.findOne(
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
      await model.Court.update(
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
      await model.CourtDetail.update(payload, { where: { courtId } }, { transaction: t });
    }
    await t.commit();

    const courtDetail = await model.Court.findOne({
      where: {
        id: courtId
      }
    });
    req.data = {
      id: courtDetail.id,
      name: courtDetail.name,
      capacity: courtDetail.capacity,
      count: courtDetail.count
    };
    req.statusCode = 200;
    next();
  } catch (error) {
    await t.rollback();
    console.log('updateCourt error:', error);
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
      attributes: ['id', 'name', 'image_url', 'description']
    };
    const courts = await model.Court.findAll(query);
    req.data = courts;
    req.statusCode = 200;
    next();
  } catch (error) {
    console.log('getAllCourts error: ', error);
    const statusCode = error.statusCode || 500;
    commonErrorHandler(req, res, error.message, statusCode, error);
  }
};

const getCourtDetails = async (req, res, next) => {
  try {
    const courtId = req.params.id;
    const date = new Date().toISOString().slice(0, 10);
    const currentTime = `${new Date().getHours()}:00`;
    const existingCourt = await model.Court.findOne({
      where: { id: courtId },
      include: {
        model: model.Booking,
        as: 'bookings',
        required: false,
        where: {
          date,
          status: 'successful'
        }
      }
    });
    if (!existingCourt) throw customException('Court not found', 404);
    const bookings = [];
    existingCourt.bookings.forEach(booking => {
      if (booking.startTime >= currentTime) bookings.push([booking.startTime, booking.endTime]);
    });
    req.data = {
      id: existingCourt.id,
      name: existingCourt.name,
      count: existingCourt.count,
      imageUrl: existingCourt.imageUrl,
      description: existingCourt.description,
      bookings
    };
    next();
  } catch (error) {
    console.log('getCourtDetails error: ', error);
    const statusCode = error.statusCode || 500;
    commonErrorHandler(req, res, error.message, statusCode, error);
  }
};

module.exports = {
  addCourt,
  updateCourt,
  getAllCourts,
  getCourtDetails
};
