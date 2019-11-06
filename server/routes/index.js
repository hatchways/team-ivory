var models  = require('../models');
var express = require("express");
var router = express.Router();

router.get("/welcome", function(req, res, next) {
  console.log("HELLO")
  models.users.findAll({
  }).then(function(users) {
    let testUser = users[0].dataValues;
    console.log(testUser);
    res.status(200).send({ welcomeMessage: "Step 1 (completed)", testUser });
  });
});

module.exports = router;
