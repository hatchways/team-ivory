'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    const notifications = [
			{
				userId: 1,
				senderId: 2,
        message: 0,
        status: 0,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				userId: 1,
				senderId: 2,
        message: 1,
        status: 0,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				userId: 1,
				senderId: 2,
        message: 1,
        status: 0,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
			{
				userId: 1,
				senderId: 2,
        message: 1,
        status: 0,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		];
		return queryInterface.bulkInsert('notifications', notifications, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('notifications', null, {});
  }
};
