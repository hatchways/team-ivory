const models = require('../models');
const jwt = require('../config/jwt')['jwtManager'];

module.exports = {
	ensureAuthenticated: async (req, res, next) => {
		console.info('Checking auth');
		const cookie = req['cookies']['jwt'];
		if (cookie) {
			console.info('Cookie exists. Validating...');
			if (await jwt.validate(cookie)) {
				console.info('Cookie verified.');
				// Get current user and attach to request
				const temp = await jwt.decode(cookie);
				const user = (
					await models.users.findOne({
						where: { username: temp.user },
					})
				).dataValues;
				req.user = user;
				return next();
			}
			// } else return res.redirect('/login');
			return res.status(400).send({
				message: 'Invalid token. Please try signing in again',
			});
		}
		console.log('Authentication failed.');
		// return res.redirect('/login');
		return res.status(400).send({ message: 'Please ensure you are signed in.' });

		// Passport method:
		//
		// if(req.isAuthenticated()) return next();
		// // Must add flash to express
		// req.flash('error_msg', 'Please log in to view that resource');
		// res.redirect('/login');
	},

	// Get current user and attach to req (if exists)
	getCurrentUser: async (req, res, next) => {
		console.info('Getting logged in user');
		const cookie = req['cookies']['jwt'];
		if (cookie) {
			console.info('Cookie exists. Getting user...');
			if (await jwt.validate(cookie)) {
				console.info('Cookie verified.');
				// Get current user and attach to request
				const temp = await jwt.decode(cookie);
				const user = (
					await models.users.findOne({
						where: { username: temp.user },
					})
				).dataValues;
				req.user = user;
				return next();
			}
		}
		console.log('User not signed in.');
		return next();
	},
};
