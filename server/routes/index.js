const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

router.get('/welcome', ensureAuthenticated, (req, res, next) => {
	console.log('Serving welcome page');
	res.status(200).send({ welcomeMessage: 'Step 1 (completed)' });
});

module.exports = router;
