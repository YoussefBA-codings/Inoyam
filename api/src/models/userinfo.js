'use strict';
const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class userInfo extends Model {
		/**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
		static associate (models) {
			userInfo.hasOne(models.User, {
				onDelete: 'cascade'
			});
		}
	}
	userInfo.init({
		revenusEmp: {
			type: DataTypes.FLOAT,
			allowNull: false
		},
		revenusCoemp: {
			type: DataTypes.FLOAT,
			allowNull: false
		},
		primesEmp: {
			type: DataTypes.FLOAT,
			allowNull: false
		},
		primesCoemp: {
			type: DataTypes.FLOAT,
			allowNull: false
		},
		totalCharges: {
			type: DataTypes.FLOAT,
			allowNull: false
		},
		totalRevenus: {
			type: DataTypes.FLOAT,
			allowNull: false
		},
		pension: {
			type: DataTypes.FLOAT,
			allowNull: false
		},
		loyer: {
			type: DataTypes.FLOAT,
			allowNull: false
		},
		pretLocatif: {
			type: DataTypes.FLOAT,
			allowNull: false
		},
		pretImmo: {
			type: DataTypes.FLOAT,
			allowNull: false
		},
		creditConso: {
			type: DataTypes.FLOAT,
			allowNull: false
		},
		creditAuto: {
			type: DataTypes.FLOAT,
			allowNull: false
		},
		autreCredit: {
			type: DataTypes.FLOAT,
			allowNull: false
		},
		revenusFin: {
			type: DataTypes.FLOAT,
			allowNull: false
		},
		alloc: {
			type: DataTypes.FLOAT,
			allowNull: false
		},
		revenusLoc: {
			type: DataTypes.FLOAT,
			allowNull: false
		}
	}, {
		sequelize,
		modelName: 'userInfo'
	});
	return userInfo;
};
