const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const models = require("../models");
const jwt = require("jsonwebtoken");
const { ensureAuthenticated } = require("../config/auth");
const Op = models.Sequelize.Op;

const secret = "5a4fs5mk45u.JN6s";

router.get("/", ensureAuthenticated, (req, res, next) => {
  console.log("user base url");
  console.log(res.user);
  models.users
    .findOne({ where: { username: res.user.user } })
    .then(function(user) {
      console.log(user.dataValues);
      const { username, firstName, lastName, email } = user.dataValues;
      res.status(200).send({ username, firstName, lastName, email });
    });
  // res.status(200).send({});
});

router.post("/signout", (req, res, next) => {
  res.clearCookie("jwt");
  res.status(200).send({ message: "Signed out." });
});

module.exports = router;
