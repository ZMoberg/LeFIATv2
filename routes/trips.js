const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('trips/index')
})

router.get('/new', (req, res) => {
    res.render('trips/new')
})



module.exports = router