const express = require('express');
const router = express.Router();
const models = require('../models');
const queries = require('../db/queries');
const jwt = require('../config/jwt')['jwtManager'];
const { ensureAuthenticated } = require('../middleware/auth');

router.put('/post', ensureAuthenticated, async (req, res) => {
	console.log('inserting post...');
	const result = await models.comments.create({
		userId: req.user.id,
		recipeId: req.body.recipeId,
		text: req.body.text,
	});

	const recipe = await models.recipes.findAll({
		where: { id: req.body.recipeId },
	});
	if (result[0] !== 0) {
		return res.json({ userId: recipe[0].dataValues.userId, commentId: result.dataValues.id });
	}
	res.json({ msg: 'failed' });
});

router.delete('/delete', ensureAuthenticated, (req, res) => {
	console.log('deleting post...');
	const result = models.comments.destroy({
		where: { id: req.body.id },
	});

	if (result[0] !== 0) {
		res.json({ msg: 'success' });
	}
	res.json({ msg: 'failed' });
});

module.exports = router;
