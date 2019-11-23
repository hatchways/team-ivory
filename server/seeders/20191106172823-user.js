'use strict';
const mock = require('../mockUsers.json');

module.exports = {
	up: (queryInterface, Sequelize) => {
		// seed test user
		const users = mock.map(user => {
			return {
				...user,
				createdAt: new Date(),
				updatedAt: new Date(),
			};
		});
		return queryInterface.bulkInsert('users', users, {});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('users', null, {});
	},
};
