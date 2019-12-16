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

const findRecipeUser = async userId => {
	const query = await models.users.findOne({ where: { id: userId } });
	if (query) {
		return query.dataValues.username;
	}
	return 'no user found';
};

const allRecipesWithFavorites = async user => {
	console.log('USERSUSERUSERUSEURSUE', user ? 'yes' : 'no');
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
			// Check if user is logged in, and if so if they liked the recipe
			const favorited = user
				? recipe.favorites.some(el => el.userId === user.id && el.favorited === 1)
					? 1
					: 0
				: 0;
			const username = await findRecipeUser(recipe.userId);
			const likes = await countFavorites(recipe);
			return {
				id: recipe.id,
				user: recipe.userId,
				username: username,
				name: recipe.name,
				imageUrl: recipe.image.replace('public', ''),
				steps: recipe.steps,
				tags: recipe.tags,
				favorited,
				likes,
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

const removeFavorite = async (userId, recipeId) => {
	const result = await models.favorites.update(
		{
			favorited: 0,
		},
		{ where: { userId: userId, recipeId: recipeId } }
	);
	return result;
};

const usersFavorites = async userId => {
	const recipes = await models.favorites.findAll({
		include: {
			model: models.recipes,
		},
		where: { userId: userId, favorited: 1 },
	});

	const favorites = await Promise.all(
		recipes.map(async recipe => {
			const username = await findRecipeUser(recipe.recipe.userId);
			const likes = await countFavorites(recipe);
			return {
				id: recipe.recipeId,
				name: recipe.recipe.name,
				userId: recipe.recipe.userId,
				username: username,
				favorited: recipe.favorited,
				imageUrl: recipe.recipe.image.replace('public', ''),
				steps: recipe.recipe.steps,
				tags: recipe.recipe.tags,
				created: recipe.recipe.createdAt,
			};
		})
	);
	return favorites;
};

const usersFollowing = async userId => {
	const query = await models.followers.findAll({
		where: { followerId: userId },
	});
	const followers = query.map(follower => {
		return {
			userId: follower.userId,
			followerID: follower.followerId,
			status: follower.status,
		};
	});
	return followers;
};

const getRecipe = recipeId => {
	const query = models.recipes.findOne({
		where: { id: recipeId },
	});
	return query;
};

const getComments = recipeId => {
	const query = models.comments.findAll({
		include: { model: models.users },
		where: { recipeId: recipeId },
		order: [['createdAt', 'desc']],
	});
	const comments = query.map(comment => {
		return {
			id: comment.id,
			userId: comment.userId,
			recipeId: comment.recipeId,
			created: comment.createdAt,
			updated: comment.updatedAt,
			text: comment.text,
			username: comment.user.dataValues.username,
		};
	});
	return comments;
};

module.exports = {
	countFavorites,
	allRecipesWithFavorites,
	removeFavorite,
	usersFavorites,
	usersFollowing,
	getRecipe,
	getComments,
};
