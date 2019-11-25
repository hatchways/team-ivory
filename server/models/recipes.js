'use strict';
module.exports = (sequelize, DataTypes) => {
	const recipes = sequelize.define(
		'recipes',
		{
			userId: DataTypes.INTEGER,
			name: DataTypes.STRING,
			image: DataTypes.STRING,
			steps: DataTypes.ARRAY(DataTypes.STRING),
			tags: DataTypes.ARRAY(DataTypes.STRING),
		},
		{}
	);
	recipes.associate = function(models) {
		recipes.hasMany(models.favorites, {
			foreignKey: 'recipeId',
		});
		recipes.hasMany(models.ingredients, {
			foreignKey: 'recipeId',
		});
		recipes.hasMany(models.comments, { foreignKEy: 'recipeId' });
	};
	return recipes;
};
