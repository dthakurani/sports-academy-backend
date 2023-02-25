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

const CustomException = function (message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode || 422;
  return error;
};
CustomException.prototype = Object.create(Error.prototype);

module.exports = {
  commonErrorHandler,
  CustomException
};
