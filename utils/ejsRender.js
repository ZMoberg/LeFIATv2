module.exports = function (req, res, templateName, options = {}) {
    res.render(templateName, {
      showSignup: !req.path.split("/")[1],
      ...options,
    });
  };