const parseArticleData = (req) => {
    let article = req.article || {};
    article.title = req.body.title;
    article.description = req.body.description;
    article.author = req.body.author;
    article.markdown = req.body.markdown;
    article.image = req.file?.path || article?.image;
    return article;
};

module.exports = { parseArticleData }

