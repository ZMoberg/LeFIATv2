const ejsRender = require("../utils/ejsRender");

const express = require('express')
const router = express.Router()

// All gear route
router.get("/", (req, res) => {
    ejsRender(req, res, "about");
  });

module.exports = router