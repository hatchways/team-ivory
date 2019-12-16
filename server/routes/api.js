var express = require('express');
var router = express.Router();
var models = require('../models');
var multer = require('multer');
const queries = require('../db/queries');
const path = require('path');
const { ensureAuthenticated, getCurrentUser } = require('../middleware/auth');

//image upload parameters for the recipe image
var imageUpload = multer({
	storage: multer.diskStorage({
		destination: function(req, file, callback) {
			callback(null, './public/uploads/recipeImages');
		},
		filename: function(req, file, callback) {
			callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
		},
	}),
}).single('image');

router.get('/recipes/following', ensureAuthenticated, async (req, res, next) => {
	req.user.id;
	const result = await models.followers.findAll({
		where: { followerId: req.user.id },
		attributes: ['userId'],
	});
	let following = [];
	result.forEach(el => following.push(el.dataValues.userId));
	console.log(following);
	const recipes = await models.recipes.findAll({
		where: { userId: following },
		include: [models.ingredients],
	});
	console.log(recipes);
	res.status(200).send(
		recipes.map(recipe => ({
			id: recipe.i,
			user: recipe.userId,
			name: recipe.name,
			imageUrl: recipe.image.replace('public', ''),
			steps: recipe.steps,
			tags: recipe.tags,
			created: recipe.createdAt,
			ingredients: recipe.ingredients.map(ingredient => {
				return {
					ingredient: {
						label: ingredient.name,
					},
					quantity: ingredient.quantity,
					unit: {
						label: ingredient.unit,
					},
				};
			}),
		}))
	);
});

// Get all recipes
router.get('/recipes', getCurrentUser, async function(req, res, next) {
	console.info('Getting recipes with favorites');
	const result = await queries.allRecipesWithFavorites(req.user);
	return res.status(200).send(result);
});

//post handler for the recipe builder
router.post('/recipes', imageUpload, async function(req, res, next) {
	const { name } = req.body;
	const steps = JSON.parse(req.body.steps); //decode the steps tags and ingredients
	const tags = JSON.parse(req.body.tags);
	const ingredients = JSON.parse(req.body.ingredients);

	//make all the tags
	Promise.all(
		tags.map(tagString => {
			return models.tags
				.create({
					name: tagString,
					createdAt: Date.now(),
					updatedAt: Date.now(),
				})
				.then(tag => {
					return tag.id;
				});
		})
	).then(tagIds => {
		//then use those ids to create a recipe
		models.recipes
			.create({
				userId: 1,
				name: name,
				image: req.file.path,
				steps: steps,
				tags: tagIds,
				ingredients: ingredients.map(ingredient => {
					return ingredient.ingredient.label;
				}),
				createdAt: Date.now(),
				updatedAt: Date.now(),
			})
			.then(newRecipe => {
				res.status(200).send({
					response: `Successfully added recipe `,
					id: newRecipe.id,
				});
			});
	});
});

router.post('/cart', ensureAuthenticated, function(req, res, next) {
	models.recipes
		.findOne({
			where: { id: req.body.recipeId },
			include: [models.ingredients],
		})
		.then(recipe => {
			models.users.findOne({ where: { id: req.user.id } }).then(user => {
				models.shoppingCart
					.findOrCreate({
						where: { userId: user.id },
						defaults: { status: 'open' },
						include: [{ model: models.ingredients, as: 'ingredients' }],
					})
					.then(carts => {
						Promise.all(
							recipe.ingredients.map(ingredient => {
								if (
									!carts[0].ingredients
										.map(ingredient => {
											return ingredient.outsideId;
										})
										.includes(ingredient.outsideId)
								) {
									models.ingredientCart.create({
										ingredientId: ingredient.id,
										cartId: carts[0].id,
									});
								}
							})
						).then(() => {
							res.status(200).send({
								response: 'Successfully added to cart',
								cartId: carts[0].id,
							});
						});
					});
			});
		});
});

router.get('/cart', ensureAuthenticated, function(req, res, next) {
	models.users.findOne({ where: { id: req.user.id } }).then(user => {
		models.shoppingCart
			.findOrCreate({
				where: { userId: user.id },
				defaults: { status: 'open' },
				include: [{ model: models.ingredients, as: 'ingredients' }],
			})
			.then(carts => {
				res.status(200).send({
					ingredients: carts[0].ingredients.map(ingredient => {
						return {
							name: ingredient.name,
							outsideId: ingredient.outsideId,
							id: ingredient.id,
						};
					}),
				});
			});
	});
});

router.delete('/cart', ensureAuthenticated, function(req, res) {
	if (req.body.itemId) {
		//delete single item
		models.users.findOne({ where: { id: req.user.id } }).then(user => {
			models.shoppingCart
				.findOrCreate({
					where: { userId: user.id },
					defaults: { status: 'open' },
					include: [{ model: models.ingredients, as: 'ingredients' }],
				})
				.then(carts => {
					models.ingredientCart
						.destroy({
							where: {
								cartId: carts[0].id,
								ingredientId: req.body.itemId,
							},
						})
						.then(deleted => {
							if (deleted) {
								res.status(200).send({
									response: 'successfully deleted item',
								});
							} else {
								res.status(400).send();
							}
						});
				});
		});
	} else {
		//clear cart
		models.users.findOne({ where: { id: req.user.id } }).then(user => {
			models.shoppingCart
				.findOrCreate({
					where: { userId: user.id },
					defaults: { status: 'open' },
					include: [{ model: models.ingredients, as: 'ingredients' }],
				})
				.then(carts => {
					models.ingredientCart
						.destroy({ where: { cartId: carts[0].id } })
						.then(deleted => {
							if (deleted) {
								res.status(200).send({
									response: 'successfully cleared cart',
								});
							} else {
								res.status(400).send();
							}
						});
				});
		});
	}
});

router.get('/recipes/:username', async (req, res, next) => {
	console.log(req.query);

	console.log('Getting user recipes');
	const username = req.params.username;
	const fetchUser = await models.users.findOne({ where: { username } });
	// Return error if request for user that does not exist
	if (!fetchUser) return res.status(400).send({ error: 'User does not exist' });

	const user = fetchUser.dataValues;

	models.recipes
		.findAll({ include: [models.ingredients], where: { userId: user.id } })
		.then(recipes => {
			res.status(200).send(
				recipes.map(recipe => {
					console.log(recipe.userId);
					return {
						id: recipe.id,
						user: recipe.userId,
						name: recipe.name,
						imageUrl: recipe.image.replace('public', ''),
						steps: recipe.steps,
						tags: recipe.tags,
						created: recipe.createdAt,
						ingredients: recipe.ingredients.map(ingredient => {
							return {
								ingredient: { label: ingredient.name },
								quantity: ingredient.quantity,
								unit: { label: ingredient.unit },
							};
						}),
					};
				})
			);
		});
});

router.post('/followers', ensureAuthenticated, function(req, res) {
	if (req.body.followId) {
		models.followers
			.create({
				followerId: req.user.id,
				userId: req.body.followId,
				status: 0,
			})
			.then(follower => {
				res.status(200).send({
					response: 'Successfully created follower relationship',
				});
			});
	}
});

router.get('/notifications', ensureAuthenticated, async function(req, res) {
	console.log('get notifications route');
	const nlist = await models.notifications.findAll({
		where: { userId: req.user.id },
		order: [['createdAt', 'DESC']],
	});
	const notifications = await Promise.all(
		nlist.map(async n => {
			const { username } = await models.users.findOne({ where: { id: n.senderId } });
			return {
				id: n.id,
				userId: n.userId,
				senderId: n.senderId,
				senderUser: username,
				message: n.message,
				recipeId: n.recipeId,
			};
		})
	);

	res.json(notifications);
});

router.post('/notifications', ensureAuthenticated, async function(req, res) {
	console.log('post notifications route');
	const { userId, senderId, message, recipeId } = req.body;
	const addNotification = await models.notifications.create({
		userId,
		senderId,
		message,
		recipeId,
	});
	res.json(addNotification);
});

router.delete('/notifications/delete', ensureAuthenticated, async function(req, res) {
	const destroy = await models.notifications.destroy({ where: { id: req.body.id } });
	if (destroy === 0) {
		res.sendStatus(400);
	} else {
		res.sendStatus(200);
	}
});

module.exports = router;
