require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const models = require('../models');
const aws = require('aws-sdk');
const path = require('path');
const queries = require('../db/queries');
const jwt = require('../config/jwt')['jwtManager'];
const { ensureAuthenticated } = require('../middleware/auth');

const { AWSAccessKeyId, AWSSecretKey, S3_Bucket } = process.env;
aws.config.update({
	region: 'us-east-2', // Put your aws region here
	accessKeyId: AWSAccessKeyId,
	secretAccessKey: AWSSecretKey,
	signatureVersion: 'v4',
});

router.get('/', ensureAuthenticated, (req, res, next) => {
	console.log('user base url');
	console.log(req.params);
	console.log(res.user);
	models.users.findOne({ where: { username: res.user.user } }).then(function(user) {
		if (user) {
			console.log(user.dataValues);
			const { username, firstName, lastName, email } = user.dataValues;
			return res.status(200).send({ username, firstName, lastName, email });
		}
		return res.status(400).send({ error: 'Requested user does not exist' });
	});
});

router.get('/profile', ensureAuthenticated, (req, res, next) => {
	console.log('Requesting profile page');
	console.log(req.user);
	const { username, firstName, lastName, email, createdAt } = req.user;
	res.status(200).send({
		user: { username, firstName, lastName, email, createdAt },
	});
});

router.get('/:username', (req, res, next) => {
	console.log('Requesting user profile');
	console.log(req.params);
	models.users.findOne({ where: { username: req.params.username } }).then(user => {
		if (user) {
			console.log(user);
			if (req.query.userId) {
				return models.followers
					.findOne({
						where: {
							userId: user.id,
							followerId: req.query.userId,
						},
					})
					.then(follower => {
						const { id, username, firstName, lastName, createdAt, image, email } = user;
						if (follower) {
							console.log('follower');
							return res.status(200).send({
								id,
								username,
								firstName,
								lastName,
								createdAt,
								image,
								email,
								followed: true,
							});
						} else {
							console.log('no follower');
							return res.status(200).send({
								id,
								username,
								firstName,
								lastName,
								createdAt,
								image,
								email,
								followed: false,
							});
						}
					});
			} else {
				const { id, username, firstName, lastName, createdAt, image, email } = user;
				return res.status(200).send({
					id,
					username,
					firstName,
					lastName,
					createdAt,
					image,
					email,
					followed: false,
				});
			}
		}
		return res.status(400).send({ error: 'Requested user does not exist' });
	});
});

router.get('/:username/favorites', ensureAuthenticated, async (req, res) => {
	console.log("User's favorites");
	// const recipes = await models.recipes.findAll({
	// 	include: [
	// 		{
	// 			model: models.ingredients,
	// 		},
	// 		{
	// 			model: models.favorites,
	// 			where: { userId: req.user.id },
	// 		},
	// 	],
	// });
	const favorites = await queries.usersFavorites(req.user.id);
	// const favorites = recipes.map(recipe => {
	// 	// Check if user is logged in, and if so if they liked the recipe
	// 	const favorited = req.user
	// 		? recipe.dataValues.favorites.some(el => el.userId === req.user.id)
	// 		: false;
	// 	const likes = recipe.dataValues.favorites.length;
	// 	return {
	// 		id: recipe.id,
	// 		user: recipe.userId,
	// 		name: recipe.name,
	// 		imageUrl: recipe.image.replace('public', ''),
	// 		steps: recipe.steps,
	// 		tags: recipe.tags,
	// 		likes,
	// 		favorited,
	// 		created: recipe.createdAt,
	// 		ingredients: recipe.ingredients.map(ingredient => {
	// 			return {
	// 				ingredient: {
	// 					label: ingredient.name,
	// 				},
	// 				quantity: ingredient.quantity,
	// 				unit: {
	// 					label: ingredient.unit,
	// 				},
	// 			};
	// 		}),
	// 	};
	// });
	res.json({ favorites });
});

router.get('/:username/followers', async (req, res) => {
	const username = req.params.username;

	const user = await models.users.findOne({ where: { username: username } });
	const { id } = user;
	const followers = await models.followers.findAll({ where: { userId: id } });

	// Find username for each follower
	const followUsername = await Promise.all(
		followers.map(async follower => {
			const { username } = await models.users.findOne({ where: { id: follower.followerId } });
			return username;
		})
	);
	res.json(followUsername);
});

router.get('/:username/following', async (req, res) => {
	const username = req.params.username;

	const user = await models.users.findOne({ where: { username: username } });
	const { id } = user;
	const following = await models.followers.findAll({ where: { followerId: id } });

	// Find username for each user followed
	const followingUsername = await Promise.all(
		following.map(async follower => {
			const { username } = await models.users.findOne({ where: { id: follower.userId } });
			return username;
		})
	);
	res.json(followingUsername);
});

router.post('/:username/favorites', ensureAuthenticated, async (req, res) => {
	const updateTo = req.body.favorited ? 1 : 0;
	const query = await models.favorites.findAll({
		where: { userId: req.body.userId, recipeId: req.body.recipeId },
	});
	if (!query[0]) {
		console.log('time to insert');
		const result = await models.favorites.create({
			userId: req.body.userId,
			recipeId: req.body.recipeId,
			favorited: 1,
		});
		res.json({ msg: 'inserted to favorites' });
	} else {
		console.log('time to update');
		const result = await models.favorites.update(
			{
				favorited: updateTo,
			},
			{ where: { id: query[0].dataValues.id } }
		);
		res.json({ msg: 'updated favorite' });
	}
});

router.post('/:username/favorites/delete', ensureAuthenticated, async (req, res) => {
	console.log('removing favorite');

	const result = await queries.removeFavorite(req.user.id, req.body.recipeId);

	res.json(result);
});

router.post('/:username/profile/upload', ensureAuthenticated, async (req, res) => {
	console.log('uploading profile image');
	const s3 = new aws.S3(); // Create a new instance of S3
	const { username, type } = req.body;
	// S3 API payload
	const s3Params = {
		Bucket: S3_Bucket,
		Key: `images/${username}.${type}`,
		Expires: 500,
		ContentType: `image/${type}`,
		ACL: 'public-read',
	};
	// Make a request to the S3 API to get a signed payload
	s3.getSignedUrl('putObject', s3Params, async (err, data) => {
		if (err) {
			console.log(err);
			res.json({ success: false, error: err });
		}

		const returnData = {
			signedRequest: data,
			url: `https://${S3_Bucket}.s3.amazonaws.com/images/${username}.${type}`,
		};
		
		models.users.update({ image: returnData.url }, { where: { id: req.user.id } });

		// Return signed payload
		res.json({ success: true, returnData });
	});
});

router.post('/passwords/change', ensureAuthenticated, async (req, res, next) => {
	const { oldPassword, newPassword } = req.body;
	console.log(oldPassword, newPassword);
	console.log(req.user);
	if (oldPassword == null || !(await bcrypt.compare(oldPassword, req.user.password))) {
		console.info('Password update request with incorrect current password.');
		return res.status(400).send({ message: 'Incorrect old password' });
	}

	if (newPassword == null)
		return res.status(400).send({ message: 'New password cannot be emtpy' });

	const hash = await bcrypt.hash(newPassword, 10);
	models.users
		.update(
			{ password: hash },
			{
				returning: true,
				fields: ['password'],
				where: { id: req.user.id },
			}
		)
		.then(async result => {
			let user;
			for (let i in result) {
				if (result[i][0]) user = result[i][0]['dataValues'];
			}
			// Update cookie to reflect the change
			const token = await jwt.generateToken(user);
			res.cookie('jwt', token);
			res.status(200).send({ message: 'Password updated' });
		});
});

router.post('/update', ensureAuthenticated, async (req, res, next) => {
	console.info(req.body);
	const { field, value } = req.body;
	let fieldName = null;
	switch (field) {
		case 'First Name':
			fieldName = 'firstName';
			break;
		case 'Last Name':
			fieldName = 'lastName';
			break;
		case 'Email':
			fieldName = 'email';
			break;
		default:
			return res.status(400).send({ message: 'Bad field request.' });
	}

	// Ensure the email is not already in system
	if (fieldName === 'email') {
		const user = await models.users.findOne({ where: { email: value } });
		if (user) return res.status(400).send({ message: 'Email already in use.' });
	}

	models.users
		.update(
			{ [fieldName]: value },
			{ returning: true, fields: [fieldName], where: { id: req.user.id } }
		)
		.then(async result => {
			let user;
			for (let i in result) {
				if (result[i][0]) user = result[i][0]['dataValues'];
			}
			// Update cookie to reflect the change
			const token = await jwt.generateToken(user);
			res.cookie('jwt', token);
			res.status(200).send('done');
		});
});

router.post('/signout', (req, res, next) => {
	res.clearCookie('jwt');
	res.status(200).send({ message: 'Signed out.' });
});

module.exports = router;
