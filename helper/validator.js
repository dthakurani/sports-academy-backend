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

module.exports = {
  validator
};
