const { Model, Sequelize } = require('sequelize');
module.exports = sequelize => {
  class CourtDetail extends Model {
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
  CourtDetail.init(
    {
      courtId: {
        type: Sequelize.UUID,
        references: {
          model: 'court',
          key: 'id'
        }
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
      modelName: 'CourtDetail',
      tableName: 'court_detail'
    }
  );
  return CourtDetail;
};
