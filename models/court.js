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
      this.hasOne(models.CourtDetails, {
        foreignKey: 'userId',
        as: 'courtDetails'
      });
    }
  }
  Court.init(
    {
      name: {
        type: Sequelize.STRING
      }
    },
    {
      sequelize,
      modelName: 'Court',
      tableName: 'court'
    }
  );
  return Court;
};
