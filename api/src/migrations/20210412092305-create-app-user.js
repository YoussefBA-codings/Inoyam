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
				type: Sequelize.STRING
			},
			lastname: {
				type: Sequelize.STRING
			},
			email: {
				type: Sequelize.STRING
			},
			adresse: {
				type: Sequelize.TEXT
			},
			password: {
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
