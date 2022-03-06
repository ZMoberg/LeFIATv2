const express = require('express')
const router = express.Router();
const User = require('../models/user')
const ejsRender = require("../utils/ejsRender");

router.get('/register', (req, res) => {
    ejsRender(req, res, 'users/register')
})


module.exports = router;