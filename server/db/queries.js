var models = require('../models');

const countFavorites = recipe => {
	return models.favorites
		.findAll({
			where: { recipeId: recipe.id, favorited: 1 },
		})
		.then(likes => {
			return likes.length;
		});
};

const allRecipesWithFavorites = () => {
	models.recipes.hasMany(models.favorites, {
		foreignKey: 'recipeId',
	});

	return models.recipes.findAll({
		include: [
			{ model: models.ingredients },
			{
				model: models.favorites,
			},
		],
		order: [['id', 'ASC']],
	});
};

module.exports = {
	countFavorites,
	allRecipesWithFavorites,
};
