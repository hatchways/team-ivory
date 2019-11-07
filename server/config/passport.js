import LocalStrategy from 'passport-local';
import bcrypt from 'bcrypt';
import db from '../models';

module.exports = passport => {
	// Configure the local strategy for use by Passport.
	//
	// The local strategy require a `verify` function which receives the credentials
	// (`username` and `password`) submitted by the user.  The function must verify
	// that the password is correct and then invoke `done` with a user object, which
	// will be set at `req.user` in route handlers after authentication.
	passport.use(
		new LocalStrategy.Strategy(function(username, password, done) {
			// User.findOne({ where: { email: username } })
			console.log(username, password);
			db.users.findOne({ where: { email: username } })
				.then(async user => {
					console.info('User found. Verifying password...');
					// Verify password
					if (
						await bcrypt.compare(password, user.password.toString())
					)
						return done(null, user);

					console.log(
						`Wrong password:
						${await bcrypt.compare(password, user.password.toString())}
						"${password}"
						 "${user.password.toString().trim()}"`
					);

					// No user/ no password match
					return done(null, false, {
						message:
							'Please ensure the entered email and password are correct.',
					});
				})
				.catch(err => {
					// Server error
					console.error('Error fetching user: ', err);
					return done(err);
				});
		})
	);

	passport.serializeUser(function(user, done) {
		console.log('Serializing');
		done(null, user.username);
	});

	passport.deserializeUser(function(id, done) {
		console.log('deserializing');
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});
};
