const express = require('express')
const multer = require('multer')
const Product = require('./../models/product')
const router = express.Router()

const storage = multer.diskStorage({

    // destination for file
    destination: function (req, file, callback) {
        callback(null, './public/products/')
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

router.get('/', async (req, res) => {
    const products = await Product.find().sort({ createdAt: 'desc' })
    res.render('gear/index', { products: products })
})

router.get('/new', (req, res) => {
    res.render('gear/new', { product: new Product() })
})

router.get('/edit/:id', async (req, res) => {
    const product = await Product.findById(req.params.id)
    res.render('gear/edit', { product: product })
})

router.get('/:slug', async (req, res) => {
    const product = await Product.findOne({ slug: req.params.slug })
    if(product == null) res.redirect('/gear')
    else res.render('gear/show', { product: product })
})

router.post('/', upload.single('image'), async (req, res, next) => {
    req.product = new Product()  
    next()
}, saveProductAndRedirect('new'))

router.put('/:id', upload.single('image'), async (req, res, next) => {
    console.log(req.file, req.body)
    req.product = await Product.findOneAndUpdate(req.params.id)
    next()
}, saveProductAndRedirect(`show`))

router.delete('/:id', async (req, res) => {
    await Product.findByIdAndDelete(req.params.id)
    res.redirect(`/gear`)
})

function saveProductAndRedirect(path) {  
    
    return async (req, res) => {
        let product = req.product
        product.title = req.body.title
        product.description = req.body.description
        product.price = req.body.price
        product.weight = req.body.weight
        product.image = req.file.path
        
        try {
            if (! req.file || ! req.file.path) {
                return res.sendStatus(400);
              }
            product = await product.save()
            res.redirect(`/gear/${product.slug}`)
        } catch(err) {  
            console.log(err)
            res.render(`gear/${path}`, { product: product })
        }      
        }
    }

//     try {
//         product = await product.save()
//         res.redirect(`/gear/${product.slug}`)
       
//     } catch(e) {  
   
//         res.render(`gear/${path}`, { product: product })
        
//     }      
//     }
// }

module.exports = router