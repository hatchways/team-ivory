import passport from 'passport';
import LocalStrategy from 'passport-local';

// Load User model
//TODO

module.exports = passport => {
	// Configure the local strategy for use by Passport.
	//
	// The local strategy require a `verify` function which receives the credentials
	// (`username` and `password`) submitted by the user.  The function must verify
	// that the password is correct and then invoke `done` with a user object, which
	// will be set at `req.user` in route handlers after authentication.
	passport.use(
		new LocalStrategy.Strategy(function(username, password, done) {
			console.log('Passport');
			// Update the db to use the user model to query the db for the user
			db.users.findByUsername(username, function(err, user) {
				if (err) {
					return done(err);
				}
				if (!user) {
					return done(null, false);
				}
				if (user.password != password) {
					return done(null, false);
				}
				return done(null, user);
			});
		})
	);
};
