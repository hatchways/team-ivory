'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface
			.removeColumn('followers', 'userOneId')
			.then(() => {
				return queryInterface.removeColumn('followers', 'userTwoId');
			});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface
			.addColumn('followers', 'userOneId', Sequelize.INTEGER)
			.then(() => {
				return queryInterface.addColumn(
					'followers',
					'userTwoId',
					Sequelize.INTEGER
				);
			});
	},
};
