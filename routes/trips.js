const express = require('express')
const multer = require('multer')
const Trip = require('./../models/trip')
const router = express.Router()

// All trips route
router.get('/', async (req, res) => {
    const trips = await Trip.find()
    res.render('trips/trips', { trips: trips })
})

// New trips route

router.get('/new', (req, res) => {
    res.render('trips/new', { trip: new Trip() })
})

router.get('/edit/:id', async (req, res) => {
    const trip = await Trip.findById(req.params.id)
    res.render('trips/edit', { trip: trip })
})

router.get('/:slug', async (req, res) => {
    const trip = await Trip.findOne({ slug: req.params.slug })
    if(trip == null) res.redirect('/trips')
    res.render('trips/show', { trip: trip })
})

router.post('/', async (req, res, next) => {
    req.trip = new Trip()
    next()
}, saveTripAndRedirect('new'))

router.put('/:id', async (req, res, next) => {
    req.trip = await Trip.findByIdAndUpdate(req.params.id)
    next()
}, saveTripAndRedirect('edit'))

router.delete('/:id', async (req, res) => {
    await Trip.findByIdAndDelete(req.params.id)
    res.redirect('/trips')
})

function saveTripAndRedirect(path) {
    return async (req, res) => {
        let trip = req.trip
        trip.title = req.body.title,
        trip.description = req.body.description
    try {
        trip = await trip.save()
        res.redirect(`/trips/${trip.slug}`)
    } catch(e) {
        res.render(`trips/${path}`, { trip: trip })
    }
    }
}


module.exports = router