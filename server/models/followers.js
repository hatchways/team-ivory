'use strict';
module.exports = (sequelize, DataTypes) => {
	const followers = sequelize.define(
		'followers',
		{
			status: DataTypes.INTEGER,
			lastActionBy: DataTypes.INTEGER,
		},
		{}
	);
	followers.associate = function(models) {};
	return followers;
};
