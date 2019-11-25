'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface
			.addColumn('followers', 'userId', Sequelize.INTEGER)
			.then(() => {
				return queryInterface.addColumn(
					'followers',
					'followerId',
					Sequelize.INTEGER
				);
			});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.removeColumn('followers', 'userId').then(() => {
			return queryInterface.removeColumn('followers', 'followerId');
		});
	},
};
