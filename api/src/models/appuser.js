'use strict';
const bcrypt = require('bcrypt');
const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class appUser extends Model {
		/**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
		static associate (models) {
			// define association here
		}
	}
	appUser.init({
		firstname: {
			allowNull: false,
			type: DataTypes.STRING
		},
		lastname: {
			allowNull: false,
			type: DataTypes.STRING
		},
		email: {
			type: DataTypes.STRING,
			unique: true

		},
		adresse: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			set (value) {
				const hash = bcrypt.hashSync(value, 10);
				this.setDataValue('password', hash);
			}
		}
	}, {
		sequelize,
		modelName: 'appUser'
	});
	return appUser;
};
