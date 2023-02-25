require('dotenv').config();

const app = require('./app');
const { sequelize } = require('./models');

const startServer = async function () {
  try {
    sequelize.authenticate();
    console.log('... Microservice db ✔');
    app.listen(process.env.SERVER_PORT);
    console.log(`--- Server started on ${process.env.SERVER_PORT} ---\n\n`);
  } catch (error) {
    console.log('server setup failed', error);
    console.log('Error: ', error.message);
  }
};

startServer();
