const { Model, Sequelize } = require('sequelize');
module.exports = sequelize => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasOne(models.UserAuthenticate, {
        foreignKey: 'userId'
      });
    }
  }
  User.init(
    {
      name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      role: {
        type: Sequelize.ENUM,
        values: ['admin', 'user'],
        defaultValue: 'user'
      },
      resetPasswordToken: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },
      resetPasswordExpires: {
        type: Sequelize.BIGINT,
        allowNull: true,
        defaultValue: null
      }
    },
    {
      sequelize,
      paranoid: true,
      modelName: 'User',
      tableName: 'user'
    }
  );
  return User;
};
