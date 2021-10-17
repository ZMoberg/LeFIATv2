const express = require('express')
const router = express.Router()

// All gear route
router.get('/', (req, res) => {
    res.render('gear')
})

// New gear route

router.get('/new', (req, res) => {
    res.render('gear/new')
})


// Create gear route
router.post('/', (req, res) => {
    res.send('Create')
})

module.exports = router