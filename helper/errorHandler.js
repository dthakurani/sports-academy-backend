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

const validator = async (req, res, schema, next) => {
  try{
    await schema.validate({
      body: req.body,
      query: req.query,
      params: req.params
    })
    return next();
  } catch (error){
    res.status(400).send({type: error.name, message: error.message})
  }
}

module.exports = {
  commonErrorHandler,
  validator
};
