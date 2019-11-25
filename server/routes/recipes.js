const express = require('express');
const router = express.Router();
const models = require('../models');
const queries = require('../db/queries');
const jwt = require('../config/jwt')['jwtManager'];
const { ensureAuthenticated } = require('../config/auth');

router.get('/:recipeId', async (req, res, next) => {
	console.log('Recipe route works!');
	const recipe = await queries.getRecipe(req.params.recipeId);
	const comments = await queries.getComments(req.params.recipeId);
	console.log(comments.length)
	res.json({ recipe, comments });
});

module.exports = router;
