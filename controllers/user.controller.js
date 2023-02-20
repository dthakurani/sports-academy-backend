const model = require("..//models");

const addUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await model.User.findOne({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      console.log("User already exists");
      return res.status(409).send({
        error: "User already exists.",
      });
    }

    const newUser = await model.User.create({
      name: name,
      email: email,
      password: password,
    });

    return res.status(200).send("user created successfully.");
  } catch (error) {
    console.log("getModalFieldData error: ", error);
    return res.status(500).send(error);
  }
};

module.exports = {
  addUser,
};
