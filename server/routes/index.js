const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const models = require("../models");
const jwt = require("jsonwebtoken");
const { ensureAuthenticated } = require("../config/auth");
const Op = models.Sequelize.Op;

const secret = "5a4fs5mk45u.JN6s";

router.get("/welcome", function(req, res, next) {
  console.log(req.cookies);
  models.users.findAll({}).then(function(users) {
    let testUser = users[0].dataValues;
    console.log(testUser);
    res.status(200).send({ welcomeMessage: "Step 1 (completed)", testUser });
  });
});

router.get("/login", (req, res, next) => {
  req.body = { username: "test@test.com", password: "test" };
  passport.authenticate("local", {
    successRedirect: "/welcome",
    failureRedirect: "/loginFail"
    // failureFlash: true,
  })(req, res, next);
});

// Login
router.post("/login", (req, res, next) => {
  passport.authenticate(
    "local",
    {
      // successRedirect: '/welcome',
      // failureRedirect: '/login',
      // failureFlash: true,
      session: false
    },
    handleLogin
  )(req, res, next);

  async function handleLogin(err, user, info) {
    if (err)
      res.status(500).send({
        message: "There was a server error processing your request."
      });
    else if (!user)
      res.status(400).send({
        message: "Please ensure that the username and password are correct."
      });
    else {
      // Token w/out expiry
      const token = await jwt.sign(
        { user: user.username, name: user.firstName },
        secret
      );
      res.cookie("jwt", token);
      res.status(200).send({ message: "Login ok." });
    }
  }
});

// Signup
router.post("/signup", (req, res, next) => {
  const { username, password, passwordConfirm, first, last, email } = req.body;
  // Ensure no fields are empty
  if (!checkInput([username, password, passwordConfirm, first, last, email])) {
    console.info("Signup attempt with empty fields.");
    return res.status(400).send({ message: "Cannot have empty fields." });
  }
  //Ensure passwords match
  if (password !== passwordConfirm) {
    console.info("Signup attempt with non-matching passwords.");
    return res.status(400).send({ message: "Passwords must match." });
  }

  // If username/email do not exist in db, create new user
  models.users
    .findOne({ where: { [Op.or]: [{ username }, { email }] } })
    .then(async user => {
      console.info(`User query complete.`);
      if (user) {
        // Return bad request if user exists
        console.info("Bad signup attempt: User exists.");
        res.status(400).send({ message: "User already exists." });
      } else {
        // Otherwise hash password and save user to db
        console.info("Creating new user.");
        const hash = await bcrypt.hash(password, 10);
        models.users.create({
          username,
          email,
          firstName: first,
          lastName: last,
          password: hash
        });
        res.status(200).send({ message: "Signup successfull." });
      }
    });

  function checkInput(inputs) {
    return inputs.every(input => input != "" && input != null);
  }
});

module.exports = router;
