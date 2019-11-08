const jwt = require("jsonwebtoken");
const secret = "5a4fs5mk45u.JN6s";

module.exports = {
  ensureAuthenticated: async (req, res, next) => {
    console.info("Checking auth");
    const cookie = req["cookies"]["jwt"];
    if (cookie) {
      console.info("Cookie exists. Validating...");
      if (await jwt.verify(cookie, secret)) {
        console.info("Cookie verified.");
        console.log();
        res.user = await jwt.decode(cookie);
        return next();
      } else return res.redirect("/login");
      //return res.status(400).send({message: 'Invalid token. Please try signing in again'});
    }
    console.log("Authentication failed.");
    return res.redirect("/login");
    //return res.status(400).send({message: 'Please ensure you are signed in.'});

    // Passport method:
    //
    // if(req.isAuthenticated()) return next();
    // // Must add flash to express
    // req.flash('error_msg', 'Please log in to view that resource');
    // res.redirect('/login');
  }
};
