const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const models  = require('../models');
const { ensureAuthenticated } = require('../config/auth');
const Op = models.Sequelize.Op;

router.get("/welcome", function(req, res, next) {
	console.log(req.cookies)
	models.users.findAll({
	}).then(function(users) {
	  let testUser = users[0].dataValues;
	  console.log(testUser);
	  res.status(200).send({ welcomeMessage: "Step 1 (completed)", testUser });
	});
});

router.get('/login', (req, res, next) => {
	req.body = {username: 'test@test.com', password: 'test'};
	passport.authenticate('local', {
		successRedirect: '/welcome',
		failureRedirect: '/loginFail',
		// failureFlash: true,
	})(req, res, next);
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
	const { username, password, passwordConfirm, first, last, email } = req.body;
	// If username/email do not exist in db, create new user
	if(checkInput([ username, password, passwordConfirm, first, last, email])) {
		if(password === passwordConfirm) {
			models.users.findOne({ where: {[Op.or] :[{username}, {email}]}}).then(async user => {
				console.info(`User query complete.`);
				if (user) {
					// Return bad request if user exists
					console.info('User exists.');
					res.status(400).send({ message: 'User already exists.' });
				} else {
					// Otherwise hash password and save user to db
					const hash = await bcrypt.hash(password, 10);
					console.log('Creating user...', hash);
					models.users.create({
						username,
						email,
						firstName: first,
						lastName: last,
						password: hash,
					});
					res.status(200).send({});
				}
			});
		} else {
			res.status(400).send({message: 'Passwords must match.'});
		}
	} else {
		res.status(400).send({message: 'Cannot have empty fields.'});
	}

	function checkInput(inputs) {
		return inputs.every(input => input != '' && input != null);
	}
});

module.exports = router;
