'use strict';
module.exports = (sequelize, DataTypes) => {
	const comments = sequelize.define(
		'comments',
		{
			userId: DataTypes.INTEGER,
			recipeId: DataTypes.INTEGER,
			text: DataTypes.STRING,
		},
		{}
	);
	comments.associate = function(models) {
		comments.belongsTo(models.recipes, {
			foreignKey: 'recipeId',
		});
		comments.belongsTo(models.users, {
			foreignKey: 'userId',
		});
	};
	return comments;
};
