const responseHandler = async (req, res) => {
  const statusCode = req.statusCode || 200;
  const { data } = req;
  const message = 'Success';

  return res.status(statusCode).send({
    message,
    data
  });
};

module.exports = {
  responseHandler
};
