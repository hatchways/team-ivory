const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const { ensureAuthenticated } = require('../config/auth');

// Load User model
import User from '../models/Users';

router.get('/welcome', ensureAuthenticated, (req, res, next) => {
	res.status(200).send({ welcomeMessage: 'Step 1 (completed)' });
});

// Login
router.post('/login', (req, res, next) => {
	passport.authenticate('local', {
		successRedirect: '/welcome',
		failureRedirect: '/login',
		// failureFlash: true,
	})(req, res, next);
});

// Signup
router.post('/signup', (req, res, next) => {
	const { username, password, passwordConfirm, name } = req.body;
	// console.log(username, password, passwordConfirm, name);
	// ADD INPUT VERIFICATION
	User.findOne({ where: { email: username } }).then(async user => {
		console.info(`User query complete.`);
		if (user) {
			// Return bad request if user exists
			res.status(400).send({ message: 'User already exists.' });
		} else {
			// Otherwise hash password and save user to db
			const hash = await bcrypt.hash(password, 10);
			User.create({
				email: username,
				password: hash,
				name,
			});
		}
	});
	res.status(200).send({});
});

module.exports = router;
