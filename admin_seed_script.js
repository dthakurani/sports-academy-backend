const prompt = require('prompt');
const colors = require('@colors/colors/safe');
const { hash } = require('bcrypt');

const models = require('./models');
const { CustomException } = require('./helper/errorHandler');

const adminSeedScript = () => {
  prompt.start();

  prompt.get(
    [
      {
        name: 'name',
        description: colors.green('Enter your name'),
        required: true
      },
      {
        name: 'email',
        description: colors.green('Enter your email'),
        required: true
      },
      {
        name: 'password',
        description: colors.green('Enter your password (at least 1 uppercase, 1 lowercase, 1 character and 1 digit and length should be 8)'),
        hidden: true,
        replace: '*',
        required: true
      }
    ],
    async (err, result) => {
      try {
        const existingUser = await models.User.findOne({
          where: {
            email: result.email
          }
        });
        if (existingUser) throw new Error('User with this email already exist');
        const hashedPassword = await hash(result.password, 10);
        await models.User.create({
          name: result.name,
          email: result.email,
          password: hashedPassword,
          role: 'admin'
        });
        console.log(colors.cyan('You are good to go.'));
      } catch (error) {
        console.log('admin seed script error:', error);
        const statusCode = error.statusCode || 500;
        CustomException(error.message, statusCode);
      }
    }
  );
};

adminSeedScript();
