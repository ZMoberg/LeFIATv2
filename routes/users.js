const express = require('express')
const router = express.Router()

// All gear route
router.get('/', (req, res) => {
    res.render('users')
})

module.exports = router