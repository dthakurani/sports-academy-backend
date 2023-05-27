const yup = require('yup');
require('yup-password')(yup);

const { responseMessages } = require('../constants');
const { validator } = require('../helper/validator');

// const addCourt = async (req, res, next) => {
//   console.log(typeof JSON.parse(req.body.data));
//   const schema = yup.object({
//     body: yup.object({
//       data: yup.object().required()
//     })
//   });
//   validator(req, res, schema, next);
// };

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

const deleteCourt = async (req, res, next) => {
  const schema = yup.object({
    params: yup.object({
      id: yup.string().uuid().required().label('court id')
    })
  });
  validator(req, res, schema, next);
};

module.exports = {
  // addCourt,
  updateCourt,
  deleteCourt
};
