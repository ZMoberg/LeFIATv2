const express = require('express')
const router = express.Router()

const multer = require('multer');
const Article = require('./../models/article')
const ejsRender = require('./../utils/ejsRender');
const catchAsync = require('./../utils/catchAsync')
const { parseArticleData, saveArticleAndRedirect } = require("../utils/blogUtil");

// multer file upload setup

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


router.get(
  '/', 
  catchAsync(async (req, res) => {
    const articles = await Article.find().sort({ createdAt: 'desc' });
    ejsRender(req, res, 'blog/index', { articles: articles });
  })
);

router.get('/new', (req, res) => {
    ejsRender(req, res, 'blog/new', { article: new Article() })
})

router.get(
  '/edit/:id', 
  catchAsync(async (req, res) => {
    const article = await Article.findById(req.params.id);
    ejsRender(req, res, 'blog/edit', { article: article });
  })
);

router.get(
  '/:slug', 
  catchAsync(async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug });
    if(article == null) res.redirect('/blog');
    else ejsRender(req, res, 'blog/show', { article: article });
  })
);

router.post(
  '/', 
  upload.single('image'), 
  catchAsync(async (req, res) => {
    req.article = new Article()
    await saveArticleAndRedirect(req, res, 'new')
  })
);

router.put(
  '/:id', 
  upload.single('image'), 
  catchAsync(async (req, res) => {
    const article = parseArticleData(req);
    try {
    req.article = await Article.findOneAndUpdate(
      { id: req.params.id },
      article
      );
    } catch (error) {
      res.redirect(`/blog/edit`, { article });
    }
    res.redirect(`/blog/${req.article.slug}`);
  })
);

router.delete(
  '/:id', 
  catchAsync(async (req, res) => {
    await Article.findByIdAndDelete(req.params.id);
    req.flash("success", "Successfully deleted a article!");
    res.redirect('/blog');
  })
);

module.exports = router