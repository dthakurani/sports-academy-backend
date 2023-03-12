const { Model, Sequelize } = require('sequelize');
module.exports = sequelize => {
  class CourtDetails extends Model {
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
    }
  }
  CourtDetails.init(
    {
      courtId: {
        type: Sequelize.UUID,
        references: {
          model: 'court',
          key: 'id'
        }
      },
      bookingType: {
        type: Sequelize.ENUM,
        values: ['single', 'multiple']
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
      modelName: 'CourtDetails',
      tableName: 'court_details'
    }
  );
  return CourtDetails;
};
