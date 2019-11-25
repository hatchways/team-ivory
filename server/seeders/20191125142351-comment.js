'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		const comments = [
      {
				userId: 1,
				recipeId: 1,
				text: 'First',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				userId: 2,
				recipeId: 1,
				text: 'What an amazing recipe! I love it!',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				userId: 2,
				recipeId: 1,
				text: "I've made this 100 times in the past two days!",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				userId: 3,
				recipeId: 1,
				text:
					'Thanks for the recipe! This is the best tasting Goulash ever!',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		];
		return queryInterface.bulkInsert('comments', comments, {});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('comments', null, {});
	},
};
