const models = require('../models');
const { customException, commonErrorHandler } = require('../helper/errorHandler');

const addCourt = async (req, res, next) => {
  try {
    const { name } = req.body;

    const existingCourt = await models.Court.findOne({
      where: {
        name
      }
    });

    if (existingCourt) {
      throw customException('Court already exists', 409);
    }

    const newCourt = await models.Court.create({
      name
    });

    req.statusCode = 201;
    req.data = {
      newCourt: newCourt.dataValues.name
    };
    next();
  } catch (error) {
    console.log('addCourt error:', error);
    const statusCode = error.statusCode || 500;
    commonErrorHandler(req, res, error.message, statusCode, error);
  }
};

module.exports = {
  addCourt
};
