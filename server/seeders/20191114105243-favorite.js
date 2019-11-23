'use strict';
const mock = require('../mockFavorites.json');

module.exports = {
	up: (queryInterface, Sequelize) => {
		// seed test favorites
		const favorites = mock.map(favorite => {
			return {
				...favorite,
				createdAt: new Date(),
				updatedAt: new Date(),
			};
		});
		return queryInterface.bulkInsert('favorites', favorites, {});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('favorites', null, {});
	},
};
