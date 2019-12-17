'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.addColumn('users', 'image', Sequelize.STRING);
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.removeColumn('users', 'image');
	},
};
