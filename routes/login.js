const passport = require('passport')
const { isLoggedIn, currentUser, isAdmin } = require('../controllers/permission')
const User = require("../models/user")

const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('users/login')
})

router.post('/', passport.authenticate('local'), (req, res) => {
    User.findOne({
      username: req.body.username
    }, (err, person) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({
        success: true,
        status: 'You are successfully logged in!'
      });
    })
  });

  router.get('/api/users/me',
  passport.authenticate('basic', { session: false }),
  function(req, res) {
    res.json({ id: req.user.id, username: req.user.username });
  });

module.exports = router