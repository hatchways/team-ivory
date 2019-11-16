const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const models = require('../models');
const jwt = require('jsonwebtoken');
const { ensureAuthenticated } = require('../config/auth');
const Op = models.Sequelize.Op;

const secret = '5a4fs5mk45u.JN6s';

router.get('/', ensureAuthenticated, (req, res, next) => {
  console.log('user base url');
  console.log(req.params);
  console.log(res.user);
  models.users.findOne({ where: { username: res.user.user } }).then(function(user) {
    console.log(user.dataValues);
    const { username, firstName, lastName, email } = user.dataValues;
    res.status(200).send({ username, firstName, lastName, email });
  });
});

router.get('/profile', ensureAuthenticated, (req, res, next) => {
  console.log('Requesting profile page');
  console.log(req.user);
  const { username, firstName, lastName, email, createdAt } = req.user;
  res.status(200).send({ user: { username, firstName, lastName, email, createdAt } });
});

router.get('/:username', (req, res, next) => {
  console.log('Requesting user profile');
  console.log(req.params);
  models.users.findOne({ where: { username: req.params.username } }).then(user => {
    if (user) {
      console.log(user.dataValues);
      const { username, firstName, lastName, createdAt } = user.dataValues;
      return res.status(200).send({ username, firstName, lastName, createdAt });
    }
    return res.status(400).send({ error: 'Requested user does not exist' });
  });
});

router.post('/signout', (req, res, next) => {
  res.clearCookie('jwt');
  res.status(200).send({ message: 'Signed out.' });
});

module.exports = router;
