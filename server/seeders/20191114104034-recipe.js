'use strict';
const mock = require('../mockRecipes.json');

module.exports = {
	up: (queryInterface, Sequelize) => {
		// seed test recipes
		const recipes = mock.map(recipe => {
			return {
				...recipe,
				createdAt: new Date(),
				updatedAt: new Date(),
			};
		});
		return queryInterface.bulkInsert('recipes', recipes, {});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('recipes', null, {});
	},
};
