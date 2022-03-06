const express = require('express')
const router = express.Router();
const User = require('../models/user')
const ejsRender = require("../utils/ejsRender");
const catchAsync = require('../utils/catchAsync')

router.get('/register', (req, res) => {
    ejsRender(req, res, 'users/register')
})

router.post('/register', catchAsync(async (req, res) => {
    const {email, username, password} = req.body
    const user = new User({email, username})
    const registeredUser = User.register(user, password)
    console.log(registeredUser)
    res.redirect('/login')
}))


module.exports = router;