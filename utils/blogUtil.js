const parseArticleData = (req) => {
    let article = req.article || {};
    article.title = req.body.title;
    article.description = req.body.description;
    article.author = req.body.author;
    article.markdown = req.body.markdown;
    article.image = req.file?.path || article?.image;
    return article;
};

const saveArticleAndRedirect = async(req, res, path) => {
  
    let article = parseArticleData(req);
    try {
      if (path !== "edit" && (!req.file || !req.file.path)) {
        return res.sendStatus(400);
      }
      article = await article.save();
      res.redirect(`/blog/${article.slug}`);
    } catch (err) {
      ejsRender(req, res, `blog/${path}`, { article });
    }
  };

module.exports = { parseArticleData, saveArticleAndRedirect }

