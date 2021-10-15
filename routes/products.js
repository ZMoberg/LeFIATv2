const express = require('express')
const router = express.Router()


// All products route
router.get('/', (req, res) => {
    res.render('products')
})

// New product route

router.get('/new', (req, res) => {
    res.render('products/new')
})


// Create product route
router.post('/', (req, res) => {
    res.send('Create')
})

module.exports = router