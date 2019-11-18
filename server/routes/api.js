var express = require("express");
var router = express.Router();
var models = require("../models");
var multer = require("multer");
const path = require("path");
const { ensureAuthenticated } = require("../config/auth");

//image upload parameters for the recipe image
var imageUpload = multer({
	storage: multer.diskStorage({
		destination: function(req, file, callback) {
			callback(null, "./public/uploads/recipeImages");
		},
		filename: function(req, file, callback) {
			callback(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
		}
	})
}).single("image");

//post handler for the recipe builder
router.post("/recipes", imageUpload, async function(req, res, next) {
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
					updatedAt: Date.now()
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
				updatedAt: Date.now()
			})
			.then(newRecipe => {
				res.status(200).send({ response: `Successfully added recipe `, id: newRecipe.id });
			});
	});
});

//placeholder to check for recipe upload
router.get("/recipes", ensureAuthenticated, function(req, res, next) {
	if ("id" in req.query) {
		const { id } = req.query;

		models.recipes
			.findOne({
				where: { id: id }
			})
			.then(recipe => {
				res.status(200).send({
					recipe: {
						name: recipe.name,
						imageUrl: recipe.image.replace("public", "")
					}
				});
			});
	} else {
		models.recipes.hasMany(models.favorites, { foreignKey: "recipeId" });
		models.recipes
			.findAll({
				include: {
					model: models.favorites,
					// where: { userId: res.user.id }
				},
				order: [["id", "ASC"]]
			})
			.then(recipes => {
				// console.log("RECIPES", recipes.length)
				const array = recipes.map(recipe => {
					// console.log(recipe.dataValues.favorites)
					if (recipe.dataValues.favorites.length !== 0) {
					console.log(recipe.dataValues.favorites[0].dataValues.userId)

					}
					// console.log(recipe.dataValues.favorites.includes(favorite => favorite.dataValues.userId === res.user.id))
					return {
						user: recipe.userId,
						name: recipe.name,
						imageUrl: recipe.image.replace("public", ""),
						steps: recipe.steps,
						tags: recipe.tags,
						// checks if there is a favorites relationship and then checks if the relationship belongs to current user
						favorited: recipe.dataValues.favorites[0]
							// ? recipe.dataValues.favorites[0].dataValues.userId === res.user.id
							? recipe.dataValues.favorites.includes(favorite => favorite.dataValues.userId === res.user.id)
								// ? recipe.dataValues.favorites[0].dataValues.favorited
								? 1
								: 0
							: 0,
						created: recipe.createdAt,
						ingredients: recipe.ingredients.map(ingredient => {
							return { ingredient: { label: ingredient }, quantity: 1, unit: "cups" };
						})
					};
				})

				// console.log(array);
				res.status(200).send(
					array
				);
			});
	}
});
module.exports = router;
