const { Model, Sequelize } = require('sequelize');
module.exports = sequelize => {
  class Court extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Booking, {
        foreignKey: 'courtId',
        as: 'bookings'
      });
    }
  }
  Court.init(
    {
      name: {
        type: Sequelize.STRING
      },
      imageUrl: {
        type: Sequelize.TEXT
      },
      description: {
        type: Sequelize.JSON,
        allowNull: true
      },
      capacity: {
        type: Sequelize.INTEGER
      },
      count: {
        type: Sequelize.INTEGER
      }
    },
    {
      sequelize,
      modelName: 'Court',
      tableName: 'court',
      paranoid: true
    }
  );
  return Court;
};
