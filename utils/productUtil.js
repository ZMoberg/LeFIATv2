const parseProductData = (req) => {
    let product = req.product || {};
    product.title = req.body.title;
    product.description = req.body.description;
    product.price = req.body.price;
    product.salePrice = req.body.salePrice;
    product.weight = req.body.weight;
    product.image = req.file?.path || product?.image;
    return product;
};

const saveProductAndRedirect = async(req, res, path) => {
  
    let product = parseProductData(req);
    try {
      if (path !== "edit" && (!req.file || !req.file.path)) {
        return res.sendStatus(400);
      }
      product = await product.save();
      res.redirect(`/gear/${product.slug}`);
    } catch (err) {
      ejsRender(req, res, `gear/${path}`, { product });
    }
  };

module.exports = { parseProductData, saveProductAndRedirect }