const express = require('express')
const router = express.Router();
const User = require('../models/user')
const ejsRender = require("../utils/ejsRender");

router.get('/register', (req, res) => {
    ejsRender(req, res, 'users/register')
})

router.post('/register', async (req, res) => {
    const {email, username, password} = req.body
    const user = new User({email, username})
    const registeredUser = User.register(user, password)
    console.log(registeredUser)
    res.redirect('/')
})


module.exports = router;