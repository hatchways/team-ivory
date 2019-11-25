'use strict';
module.exports = (sequelize, DataTypes) => {
	const likes = sequelize.define(
		'likes',
		{
			userId: DataTypes.INTEGER,
			recipeId: DataTypes.INTEGER,
			true: DataTypes.INTEGER,
		},
		{}
	);
	likes.associate = function(models) {
		// associations can be defined here
	};
	return likes;
};
