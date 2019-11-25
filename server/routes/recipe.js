const express = require('express');
const router = express.Router();
const passport = require('passport');
const models = require('../models');
const queries = require('../db/queries');
const jwt = require('../config/jwt')['jwtManager'];
const { ensureAuthenticated } = require('../config/auth');

router.get('/:recipeId', async (req, res, next) => {
	console.log('Route works!');
	const recipe = await queries.getRecipe(req.params.recipeId);
	res.json(recipe);
});

module.exports = router;
