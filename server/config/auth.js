module.exports = {
	ensureAuthenticated: (req, res, next) => {
		console.log('Checking auth');
		console.log(req.isAuthenticated());
		return next();
		// Actual method
		//
		// if(req.isAuthenticated()) return next();
		// // Must add flash to express
		// req.flash('error_msg', 'Please log in to view that resource');
		// res.redirect('/login');
	},
};
