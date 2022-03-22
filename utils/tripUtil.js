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

const saveLocationAndRedirect = async(req, res, path) => {
  
    let location  = parseLocationData(req);
    try {
      if (path !== "edit" && (!req.file || !req.file.path)) {
        return res.sendStatus(400);
      }
      location   = await location.save();
      res.redirect(`/trips/${location.slug}`);
    } catch (err) {
      ejsRender(req, res, `trips/${path}`, { location });
    }
  };


module.exports = { parseLocationData, saveLocationAndRedirect }