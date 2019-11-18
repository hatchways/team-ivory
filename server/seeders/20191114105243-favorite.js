"use strict";

module.exports = {
	up: (queryInterface, Sequelize) => {
		// seed test favorites
		const favorites = [
			{
				userId: 1,
				recipeId: 1,
				favorited: 1,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				userId: 1,
				recipeId: 2,
				favorited: 0,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				userId: 1,
				recipeId: 3,
				favorited: 1,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				userId: 1,
				recipeId: 7,
				favorited: 1,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				userId: 2,
				recipeId: 3,
				favorited: 1,
				createdAt: new Date(),
				updatedAt: new Date()
			},
			{
				userId: 2,
				recipeId: 1,
				favorited: 0,
				createdAt: new Date(),
				updatedAt: new Date()
			}
		];

		return queryInterface.bulkInsert("favorites", favorites, {});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete("favorites", null, {});
	}
};
