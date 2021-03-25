'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Immobiliers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_site_source: {
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      city: {
        type: Sequelize.STRING
      },
      code_postal: {
        type: Sequelize.INTEGER
      },
      publicationDate: {
        type: Sequelize.DATE
      },
      url: {
        type: Sequelize.TEXT
      },
      publication_id: {
        type: Sequelize.INTEGER,
        unique: {
          msg: `L'annonce existe déjà`
        }
      },
      category: {
        type: Sequelize.STRING
      },
      rooms: {
        type: Sequelize.INTEGER
      },
      bedrooms: {
        type: Sequelize.INTEGER
      },
      medias: {
        type: Sequelize.JSON
      },
      surface: {
        type: Sequelize.FLOAT
      },
      etage_bien: {
        type: Sequelize.INTEGER
      },
      price: {
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.TEXT
      },
      seller_type: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Immobiliers');
  }
};