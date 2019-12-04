'use strict';
module.exports = (sequelize, DataTypes) => {
	const notifications = sequelize.define(
		'notifications',
		{
			userId: DataTypes.INTEGER,
			senderId: DataTypes.INTEGER,
			message: DataTypes.INTEGER,
			status: DataTypes.INTEGER,
		},
		{}
	);
	notifications.associate = function(models) {
		// associations can be defined here
	};
	return notifications;
};
