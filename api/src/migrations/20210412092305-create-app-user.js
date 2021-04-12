'use strict';
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('appUsers', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			firstname: {
				allowNull: false,
				type: Sequelize.STRING
			},
			lastname: {
				allowNull: false,
				type: Sequelize.STRING
			},
			email: {
				unique: {
					msg: 'L\'utilisateur existe déjà,'
				},
				allowNull: false,
				type: Sequelize.STRING
			},
			adresse: {
				allowNull: false,
				type: Sequelize.TEXT
			},
			password: {
				allowNull: false,
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
		await queryInterface.dropTable('appUsers');
	}
};
