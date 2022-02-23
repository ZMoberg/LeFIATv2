const ejsRender = require("../utils/ejsRender");

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
    ejsRender(req, res, 'home')
})

module.exports = router