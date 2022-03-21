const express = require('express')
const router = express.Router()

const multer = require('multer')
const Location = require('./../models/location')
const catchAsync = require('./../utils/catchAsync')
const ejsRender = require("../utils/ejsRender");
const { parseLocationData, saveLocationAndRedirect } = require("../utils/tripUtil");



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
router.get(
    '/', 
    catchAsync(async (req, res) => {
        const locations = await Location.find().sort({ createdAt: "desc" });
        ejsRender(req, res, 'trips/trips', { locations: locations });
    })
);

// New trips route

router.get('/new', (req, res) => {
    ejsRender(req, res, 'trips/new', { location: new Location() })
})

router.get(
    '/edit/:id', 
    catchAsync(async (req, res) => {
        const location = await Location.findById(req.params.id);
        ejsRender(req, res, 'trips/edit', { location: location });
    })
);

router.get(
    '/:slug', 
    catchAsync(async (req, res) => {
        const location = await Location.findOne({ slug: req.params.slug })
        if (location == null) return res.redirect('/trips');
        else ejsRender(req, res, 'trips/show', { location: location });
    })
);

router.post(
    '/', 
    upload.single('image'), 
    catchAsync(async (req, res) => {
        req.location = new Location();
        await saveLocationAndRedirect(req, res, 'new')
    })
);

router.put(
    '/:id', 
    upload.single('image'), 
    catchAsync(async (req, res) => {
        const location = parseLocationData(req);
        try {
            req.location = await Location.findByIdAndUpdate(
                { id: req.params.id },
                location
            );
            } catch (error) {
                res.redirect(`/trips/edit`, { location });
            }
            res.redirect(`/trips/${req.location.slug}`);
        })
);
        

router.delete(
    '/:id', 
    catchAsync(async (req, res) => {
        await Location.findByIdAndDelete(req.params.id);
        req.flash("success", "Successfully deleted a trip!");
        res.redirect('/trips');
    })
);

// function saveLocationAndRedirect(path) {
//     return async (req, res) => {
//         let location = req.location
//         location.title = req.body.title,
//         location.description = req.body.description
//         location.price = req.body.price
//         location.days = req.body.days
//         location.nights = req.body.nights
//         location.date = req.body.date
//         location.image = req.file.path
//     try {    
//         location = await location.save()  
//         res.redirect(`/trips/${location.slug}`)
//     } catch(e) {
//         ejsRender(req, res, `trips/${path}`, { location: location })
//     }
//     }
// }

// async function saveLocationAndRedirect(req, res, path) {
  
//     let location  = parseLocationData(req);
//     try {
//       if (path !== "edit" && (!req.file || !req.file.path)) {
//         return res.sendStatus(400);
//       }
//       location   = await location.save();
//       res.redirect(`/trips/${location.slug}`);
//     } catch (err) {
//       ejsRender(req, res, `trips/${path}`, { location });
//     }
//   };


module.exports = router