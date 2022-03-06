const ejsRender = require("../utils/ejsRender");

const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    ejsRender(req, res, 'home')
})

module.exports = router