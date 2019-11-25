'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.removeColumn('recipes', 'ingredients');
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.addColumn(
			'recipes',
			'ingredients',
			Sequelize.ARRAY(Sequelize.STRING)
		);
	},
};
