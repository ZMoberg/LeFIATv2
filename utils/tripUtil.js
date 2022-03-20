const parseLocationData = (req) => {
    let location = req.location || {};
    location.title = req.body.title,
    location.description = req.body.description
    location.price = req.body.price
    location.days = req.body.days
    location.nights = req.body.nights
    location.date = req.body.date
    location.image = req.file?.path || location?.image;
    return location;
};

module.exports = { parseLocationData }