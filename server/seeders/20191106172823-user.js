"use strict";

module.exports = {
	up: (queryInterface, Sequelize) => {
		// seed test user
		const users = [
			{
				username: "testuser",
				firstName: "Goulash",
				lastName: "Man",
				email: "test@test.com",
				password: "$2b$10$xJa4xYq7WvnA1d63TDSar.qPE87u21VXatJ8nHRi8g9HxTyWn7f56",
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				username: "testuser2",
				firstName: "Limp",
				lastName: "Bizkit",
				email: "test2@test.com",
				password: "$2b$10$xJa4xYq7WvnA1d63TDSar.qPE87u21VXatJ8nHRi8g9HxTyWn7f56",
				createdAt: new Date(),
				updatedAt: new Date()
			}
		];

		return queryInterface.bulkInsert("users", users, {});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete("users", null, {});
	}
};
