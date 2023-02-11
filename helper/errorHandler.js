const commonErrorHandler = async (res, message, statusCode = 500) => {
  let errorMessage = "Something went wrong. Please try again";
  if (message) {
    errorMessage = message;
  }

  const response = {
    statusCode,
    data: {},
    message: errorMessage,
  };
  console.error(message);
  res.status(statusCode).send(response);
};

module.exports = {
  commonErrorHandler,
};
