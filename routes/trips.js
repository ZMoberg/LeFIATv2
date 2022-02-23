const multer = require('multer')

const ejsRender = require("../utils/ejsRender");
const Location = require('./../models/location')

const express = require('express')
const router = express.Router()

const storage = multer.diskStorage({

    // destination for file
    destination: function (req, file, callback) {
        callback(null, './public/uploads')
    },
    // add back the extension
    filename: function (req, file, callback) {
        callback(null, new Date().toISOString() + file.originalname)
    },
})

const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };

// upload parameters for multer 

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024*1024*3,
    },
    fileFilter: fileFilter
})

// All trips route
router.get('/', async (req, res) => {
    const locations = await Location.find()
    ejsRender(req, res, 'trips/trips', { locations: locations })
    // res.render('trips/trips', { locations: locations })
})

// New trips route

router.get('/new', (req, res) => {
    ejsRender(req, res, 'trips/new', { location: new Location() })
    // res.render('trips/new', { location: new Location() })
})

router.get('/edit/:id', async (req, res) => {
    const location = await Location.findById(req.params.id)
    ejsRender(req, res, 'trips/edit', { location: location })
    // res.render('trips/edit', { location: location })
})

router.get('/:slug', async (req, res) => {
    const location = await Location.findOne({ slug: req.params.slug })
    if (location == null) return res.redirect('/trips')
    ejsRender(req, res, 'trips/show', { location: location })
    // res.render('trips/show', { location: location })
})

router.post('/', upload.single('image'), async (req, res, next) => {
    req.location = new Location()
    next()
}, saveLocationAndRedirect('new'))

router.put('/:id', upload.single('image'), async (req, res, next) => {
    req.location = await Location.findByIdAndUpdate(req.params.id)
    next()
}, saveLocationAndRedirect('edit'))

router.delete('/:id', async (req, res) => {
    await Location.findByIdAndDelete(req.params.id)
    res.redirect('/trips')
})

function saveLocationAndRedirect(path) {
    return async (req, res) => {
        let location = req.location
        location.title = req.body.title,
        location.description = req.body.description
        location.price = req.body.price
        location.days = req.body.days
        location.nights = req.body.nights
        location.date = req.body.date
        location.image = req.file.path
    try {    
        location = await location.save()  
        res.redirect(`/trips/${location.slug}`)
    } catch(e) {
        ejsRender(req, res, `trips/${path}`, { location: location })
        // res.render(`trips/${path}`, { location: location })
    }
    }
}


module.exports = router