'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class bot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  bot.init({
    nom: DataTypes.STRING,
    url: DataTypes.STRING,
    annonceNumber: DataTypes.INTEGER,
    bddAnnonceNumber: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'bot',
  });
  return bot;
};