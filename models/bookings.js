const { Model, Sequelize } = require('sequelize');
module.exports = sequelize => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Court, {
        foreignKey: 'courtId',
        targetKey: 'id',
        as: 'court'
      });
      this.belongsTo(models.User, {
        foreignKey: 'userId',
        targetKey: 'id',
        as: 'user'
      });
    }
  }
  Booking.init(
    {
      courtId: {
        type: Sequelize.UUID,
        references: {
          model: 'court',
          key: 'id'
        }
      },
      userId: {
        type: Sequelize.UUID,
        references: {
          model: 'user',
          key: 'id'
        }
      },
      date: {
        type: Sequelize.DATE
      },
      start_time: {
        type: Sequelize.DATE
      },
      end_time: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.ENUM,
        values: ['successful', 'cancel', 'reject', 'pending']
      }
    },
    {
      sequelize,
      paranoid: true,
      modelName: 'Booking',
      tableName: 'booking'
    }
  );
  return Booking;
};
