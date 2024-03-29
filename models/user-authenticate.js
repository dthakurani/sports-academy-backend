const { Model, Sequelize } = require('sequelize');
module.exports = sequelize => {
  class UserAuthenticate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'userId',
        targetKey: 'id',
        as: 'user'
      });
    }
  }
  UserAuthenticate.init(
    {
      userId: {
        type: Sequelize.UUID,
        references: {
          model: 'user',
          key: 'id'
        }
      },
      refreshTokenId: {
        type: Sequelize.STRING
      },
      accessTokenId: {
        type: Sequelize.STRING
      },
      refreshTokenExpireTime: {
        type: Sequelize.BIGINT
      }
    },
    {
      sequelize,
      modelName: 'UserAuthenticate',
      tableName: 'user_authenticate'
    }
  );
  return UserAuthenticate;
};
