'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.addColumn(
			'ingredients',
			'recipeId',
			Sequelize.INTEGER
		);
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.removeColumn('ingredients', 'recipeId');
	},
};
