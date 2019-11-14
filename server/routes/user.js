const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const models = require("../models");
const jwt = require("jsonwebtoken");
const { ensureAuthenticated } = require("../config/auth");
const Op = models.Sequelize.Op;

const secret = "5a4fs5mk45u.JN6s";

router.get("/", ensureAuthenticated, (req, res, next) => {
	console.log("user base url");
	console.log(req.params);
	console.log(res.user);
	models.users.findOne({ where: { username: res.user.user } }).then(function(user) {
		console.log(user.dataValues);
		const { username, firstName, lastName, email } = user.dataValues;
		res.status(200).send({ username, firstName, lastName, email });
	});
	// res.status(200).send({});
});

router.get("/:username", (req, res, next) => {
	console.log("User request");
	console.log(req.params);
	models.users.findOne({ where: { username: req.params.username } }).then(function(user) {
		console.log(user.dataValues);
		const { id, username, firstName, lastName, email } = user.dataValues;
		res.status(200).send({ id, username, firstName, lastName, email });
	});
});

router.post("/:username/favorites", (req, res) => {
	console.log("User's favorites");
	console.log(req.body);
	// models.users.hasMany(models.favorites), {foreign_key: 'userId'};
	models.recipes.hasMany(models.favorites), { foreign_key: "recipeId" };
	// models.recipes.belongsTo(models.users, {foreign_key: "userId"})
	models.recipes
		.findAll({
			include: {
				model: models.favorites,
				where: { userId: req.body.id }
			}
		})
		.then(function(recipes) {
			const favorites = recipes.map(recipe => recipe.dataValues);
			res.status(200).send({ favorites });
		});
});

router.post("/signout", (req, res, next) => {
	res.clearCookie("jwt");
	res.status(200).send({ message: "Signed out." });
});

module.exports = router;
