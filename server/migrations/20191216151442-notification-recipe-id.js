'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.renameColumn('notifications', 'status', 'recipeId');
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.renameColumn('notifications', 'recipeId', 'status');
	},
};
