"use strict";
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable("friendships", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			userOneId: {
				type: Sequelize.INTEGER,
				unique: "compositeIndex"
			},
			userTwoId: {
				type: Sequelize.INTEGER,
				unique: "compositeIndex"
			},
			status: {
				type: Sequelize.INTEGER
			},
			lastActionBy: {
				type: Sequelize.INTEGER
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
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable("friendships");
	}
};
