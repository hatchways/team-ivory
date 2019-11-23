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

const allRecipesWithFavorites = async userId => {
	models.recipes.hasMany(models.favorites, {
		foreignKey: 'recipeId',
	});

	const allRecipes = await models.recipes.findAll({
		include: [
			{ model: models.ingredients },
			{
				model: models.favorites,
			},
		],
		order: [['id', 'ASC']],
	});

	const mappedRecipes = await Promise.all(
		allRecipes.map(async recipe => {
			console.log('THIS RUNS THIS RUNS');
			const likes = await countFavorites(recipe);
			return {
				id: recipe.id,
				user: recipe.userId,
				name: recipe.name,
				imageUrl: recipe.image.replace('public', ''),
				steps: recipe.steps,
				tags: recipe.tags,
				//checks if there is a favorites relationship and then checks if the relationship belongs to current user
				favorited: recipe.favorites[0]
					? recipe.favorites.some(
							favorite =>
								favorite.userId === userId &&
								favorite.favorited === 1
					  )
						? 1
						: 0
					: 0,
				likes: likes,
				created: recipe.createdAt,
				ingredients: recipe.ingredients.map(ingredient => {
					return {
						ingredient: {
							label: ingredient.name,
						},
						quantity: ingredient.quantity,
						unit: { label: ingredient.unit },
					};
				}),
			};
		})
	);
	return mappedRecipes;
};

module.exports = {
	countFavorites,
	allRecipesWithFavorites,
};
