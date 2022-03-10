const parseProductData = (req) => {
    let product = req.product || {};
    product.title = req.body.title;
    product.description = req.body.description;
    product.price = req.body.price;
    product.weight = req.body.weight;
    product.image = req.file?.path || product?.image;
    return product;
};

module.exports = { parseProductData }