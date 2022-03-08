const express = require('express')
const router = express.Router();
const passport = require('passport');
const User = require('../models/user')
const ejsRender = require("../utils/ejsRender");
const catchAsync = require('../utils/catchAsync')

router.get('/register', (req, res) => {
    ejsRender(req, res, 'users/register')
})

router.post('/register', catchAsync(async (req, res, next) => {
  try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);
      req.login(registeredUser, err => {
          if (err) return next(err);
          req.flash('success', 'Welcome LeFIAT!');
          res.redirect('/login');
      })
  } catch (e) {
      req.flash('error', e.message);
      res.redirect('register');
  }
}));

  router.get('/login', (req, res) => {
    ejsRender(req, res, 'users/login');
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
  req.flash('success', 'welcome back!');
  const redirectUrl = req.session.returnTo || '/';
  delete req.session.returnTo;
  res.redirect(redirectUrl);
})

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', "Goodbye!");
  res.redirect('/');
})

module.exports = router;