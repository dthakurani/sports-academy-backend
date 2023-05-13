const yup = require('yup');
require('yup-password')(yup);

const { responseMessages } = require('../constants');
const { validator } = require('../helper/validator');

const addCourt = async (req, res, next) => {
  const schema = yup.object({
    body: yup.object({
      name: yup
        .string()
        .matches(/^[A-Za-z\s]+$/, responseMessages.INVALID_USERNAME)
        .required()
        .label('court name'),
      capacity: yup.number().integer().positive().nullable(true).required().label('capacity'),
      count: yup.number().integer().positive().nullable(true).required().label('count')
    }),
    description: yup.object().required().label('description')
  });
  validator(req, res, schema, next);
};

const updateCourt = async (req, res, next) => {
  const schema = yup.object({
    params: yup.object({
      id: yup.string().uuid().required().label('court id')
    }),
    body: yup.object({
      name: yup
        .string()
        .matches(/^[A-Za-z\s]+$/, responseMessages.INVALID_USERNAME)
        .label('court name'),
      capacity: yup.number().integer().positive().nullable(true).label('capacity'),
      count: yup.number().integer().positive().nullable(true).label('count')
    })
  });
  validator(req, res, schema, next);
};

module.exports = {
  addCourt,
  updateCourt
};
