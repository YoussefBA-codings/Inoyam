'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Immobilier extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Immobilier.init({
    id_site_source: DataTypes.INTEGER,
    title: DataTypes.STRING,
    city: DataTypes.STRING,
    code_postal: DataTypes.INTEGER,
    publicationDate: DataTypes.DATE,
    url: DataTypes.TEXT,
    publication_id: DataTypes.INTEGER,
    category: DataTypes.STRING,
    rooms: DataTypes.INTEGER,
    bedrooms: DataTypes.INTEGER,
    medias: DataTypes.JSON,
    surface: DataTypes.FLOAT,
    etage_bien: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    seller_type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Immobilier'
  });
  return Immobilier;
};