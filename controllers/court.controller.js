const { sequelize } = require('../models');

const model = require('../models');
const { customException, commonErrorHandler } = require('../helper/errorHandler');
const s3 = require('../helper/s3');

const addCourt = async (req, res, next) => {
  try {
    const { file } = req;
    const body = JSON.parse(req.body.data);
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
  try {
    const { file } = req;
    console.log(req.body);
    const body = JSON.parse(req.body.data);
    const courtId = req.params.id;
    const { name, description, capacity, count } = body;
    let s3Upload;
    const existingCourt = await model.Court.findOne({
      where: {
        id: courtId
      }
    });

    if (!existingCourt) {
      throw customException('Court not found', 404);
    }
    if (file) {
      const fileName = name.replace(/\s+/g, '-').toLowerCase();
      s3Upload = await s3.uploadImage(file, fileName);
    }

    const courtDetail = await model.Court.update(
      { name, capacity, count, description, imageUrl: s3Upload.Location },
      { where: { id: courtId }, returning: true, plain: true }
    );

    req.data = {
      id: courtDetail.id,
      name: courtDetail.name,
      imageUrl: courtDetail.imageUrl,
      description: courtDetail.description,
      capacity: courtDetail.capacity,
      count: courtDetail.count
    };
    req.statusCode = 200;
    next();
  } catch (error) {
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
      attributes: ['id', 'name', 'image_url', 'description', 'capacity', 'count']
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

const deleteCourt = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const courtId = req.params.id;
    const existingCourt = await model.Court.findOne({
      where: {
        id: courtId
      }
    });

    if (!existingCourt) {
      throw customException('Court not found', 404);
    }

    await model.Court.destroy(
      {
        where: {
          id: courtId
        }
      },
      transaction
    );

    await model.Booking.update(
      {
        status: 'cancel'
      },
      {
        where: {
          courtId
        }
      },
      transaction
    );
    await transaction.commit();
    req.statusCode = 204;
    next();
  } catch (error) {
    await transaction.rollback();
    console.log('delete court error: ', error);
    const statusCode = error.statusCode || 500;
    commonErrorHandler(req, res, error.message, statusCode, error);
  }
};

module.exports = {
  addCourt,
  updateCourt,
  getAllCourts,
  deleteCourt
};
