const express = require('express')
const multer = require('multer');
const ejsRender = require('./../utils/ejsRender');
const Article = require('./../models/article')
const router = express.Router()

const storage = multer.diskStorage({
    // destination for file
    destination: function (req, file, callback) {
      callback(null, "./public/uploads/");
    },
    // add back the extension
    filename: function (req, file, callback) {
      callback(
        null,
        new Date().toISOString().replace(/[:\.]/g, "-") + file.originalname
      );
    },
  });

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
    const articles = await Article.find().sort({ createdAt: 'desc' })
    ejsRender(req, res, 'blog/index', { articles: articles })
    // res.render('blog/index', { articles: articles })
})

router.get('/new', (req, res) => {
    ejsRender(req, res, 'blog/new', { article: new Article() })
    // res.render('blog/new', { article: new Article() })
})

router.get('/edit/:id', async (req, res) => {
    const article = await Article.findById(req.params.id)
    ejsRender(req, res, 'blog/edit', { article: article })
    // res.render('blog/edit', { article: article })
})

router.get('/:slug', async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug })
    if(article == null) res.redirect('/blog')
    else res.render('blog/show', { article: article })
})

router.post('/', upload.single('image'), async (req, res, next) => {
    req.article = new Article()
    next()
}, saveArticleAndRedirect('new'))

router.put('/:id', upload.single('image'), async (req, res, next) => {
    console.log(req.file, req.body)
    req.article = await Article.findOneAndUpdate({ slug: req.params.slug })
    next()
}, saveArticleAndRedirect('edit'))

router.delete('/:id', async (req, res) => {
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/blog')
})

function saveArticleAndRedirect(path) {
    
    return async (req, res) => {
        let article = req.article
        article.title = req.body.title
        article.description = req.body.description
        article.author = req.body.author
        article.markdown = req.body.markdown
        article.image = req.file.path
    try {
        if (! req.file != null && ! req.file.path !== '') {
            return res.sendStatus(400);
          }
        article = await article.save()
        res.redirect(`/blog/${article.slug}`)
    } catch(err) {  
        if (article != null) {
            console.log(err)
            res.render(`blog/${path}`, { article: article })
        } else {
            redirect('/edit')
        }
        
    }      
    }
}




module.exports = router