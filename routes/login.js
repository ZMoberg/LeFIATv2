const passport = require('passport')
// const { isLoggedIn, currentUser, isAdmin } = require('../controllers/permission')
const User = require("../models/user")

const express = require('express')
const router = express.Router()

// function isLoggedIn(req, res, next) {
// 	if (req.isAuthenticated()) return next();
// 	res.redirect('users/login');
// }


// function isLoggedOut(req, res, next) {
// 	if (!req.isAuthenticated()) return next();
// 	res.redirect('/');
// }

router.get('/', (req, res) => {
    res.render('users/login')
})

// router.get('/', isLoggedIn, (req, res) => {
// 	const response = {
// 		title: "Login",
// 		error: req.query.error
// 	}
// 	res.render('users/login', response);
// });
// isLoggedOut,
router.get('/login',  (req, res) => {
	const response = {
		title: "Login",   
		error: req.query.error
	}
	res.render('login', response);
});

  router.post('/', passport.authenticate('local', {
    successRedirect:'/',
    failureRedirect: '/login?error=true'
  }))
  
  router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/home');
  });
  
  router.get('/api/users/me',
  passport.authenticate('basic', { session: false }),
  function(req, res) {
    res.json({ id: req.user.id, username: req.user.username });
  });

module.exports = router