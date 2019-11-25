var express = require('express');
var router = express.Router();
var models = require('../models');
var multer = require('multer');
const queries = require('../db/queries');
const path = require('path');
const { ensureAuthenticated } = require('../config/auth');

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

//placeholder to check for recipe upload
router.get('/recipes', ensureAuthenticated, async function(req, res, next) {
	if ('id' in req.query) {
		const { id } = req.query;

		models.recipes
			.findOne({
				where: { id: id },
			})
			.then(recipe => {
				res.status(200).send({
					recipe: {
						name: recipe.name,
						imageUrl: recipe.image.replace('public', ''),
					},
				});
			});
	} else if(req.user) {
		models.recipes.hasMany(models.favorites, { foreignKey: 'recipeId' });
		models.followers.findAll({where:{followerId: req.user.id}}).then((followed)=>{
			models.recipes
			.findAll({
				include: [
					{ model: models.ingredients },
					{
						model: models.favorites,
						where: { userId: followed.map((follower)=>{return follower.userId}) }
					},
				],
				order: [['id', 'ASC']],
			})
			.then(recipes => {
				res.status(200).send(
					recipes.map(recipe => {
						// console.log(recipe.ingredients)
						return {
							id: recipe.id,
							user: recipe.userId,
							name: recipe.name,
							imageUrl: recipe.image.replace('public', ''),
							steps: recipe.steps,
							tags: recipe.tags,
							//checks if there is a favorites relationship and then checks if the relationship belongs to current user
							favorited: recipe.dataValues.favorites[0]
								? recipe.dataValues.favorites.some(
										favorite => favorite.dataValues.userId === req.user.id && favorite.dataValues.favorited === 1
								  )
									? 1
									: 0
								: 0,
							created: recipe.createdAt,
							ingredients: recipe.ingredients.map(ingredient => {
								return { ingredient: { label: ingredient.name }, quantity: ingredient.quantity, unit: { label: ingredient.unit } };
							}),
						};
					})
				);
			});
		})
	} else {
		const allRecipes = await queries.allRecipesWithFavorites(req.user.id);
	
		res.status(200).send(allRecipes);
	}
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
				res.status(200).send({ response: `Successfully added recipe `, id: newRecipe.id });
			});
	});
});

router.post('/cart', ensureAuthenticated, function(req, res, next) {
	models.recipes.findOne({ where: { id: req.body.recipeId }, include: [models.ingredients] }).then(recipe => {
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
						res.status(200).send({ response: 'Successfully added to cart', cartId: carts[0].id });
					});
				});
		});
	});
});

router.get('/cart', ensureAuthenticated, function(req, res, next) {
	models.users.findOne({ where: { id: req.user.id } }).then(user => {
		models.shoppingCart
			.findOrCreate({ where: { userId: user.id }, defaults: { status: 'open' }, include: [{ model: models.ingredients, as: 'ingredients' }] })
			.then(carts => {
				res.status(200).send({
					ingredients: carts[0].ingredients.map(ingredient => {
						return { name: ingredient.name, outsideId: ingredient.outsideId, id: ingredient.id };
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
					models.ingredientCart.destroy({ where: { cartId: carts[0].id, ingredientId: req.body.itemId } }).then(deleted => {
						if (deleted) {
							res.status(200).send({ response: 'successfully deleted item' });
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
					models.ingredientCart.destroy({ where: { cartId: carts[0].id } }).then(deleted => {
						if (deleted) {
							res.status(200).send({ response: 'successfully cleared cart' });
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

	models.recipes.findAll({ include: [models.ingredients], where: { userId: user.id } }).then(recipes => {
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
						return { ingredient: { label: ingredient.name }, quantity: ingredient.quantity, unit: { label: ingredient.unit } };
					}),
				};
			})
		);
	});
});

router.post('/followers', ensureAuthenticated, function(req, res){
	if(req.body.followId){
		models.followers.create({
			followerId: req.user.id,
			userId: req.body.followId,
			status: 0
		}).then((follower)=>{
			res.status(200).send({response: 'Successfully created follower relationship'})
		})
	}
})
module.exports = router;
