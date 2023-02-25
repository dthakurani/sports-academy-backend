const commonErrorHandler = async (req, res, message, statusCode = 500, error = null) => {
  let errorMessage = 'Something went wrong. Please try again';
  if (message) {
    errorMessage = message;
  }

  if (error && error.message) {
    errorMessage = error.message;
  }
  req.error = error;

  const response = {
    statusCode,
    data: {},
    message: errorMessage
  };

  res.status(statusCode).send(response);
};

const validator = async (req, res, schema, next) => {
  try {
    await schema.validate({
      body: req.body,
      query: req.query,
      params: req.params
    });
    return next();
  } catch (error) {
    return res.status(400).send({ type: error.name, message: error.message });
  }
};
const customException = function (message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode || 422;
  return error;
};
customException.prototype = Object.create(Error.prototype);

module.exports = {
  commonErrorHandler,
  validator,
  customException
};
