const User = require("../models/user")

const express = require('express')
const router = express.Router()

router.get('/logout', (req, res) => {
    
})

router.post('/logout', (req, res, next) => {
    if (req.session) {
      req.logout();
      req.session.destroy((err) => {
        if (err) {
          console.log(err);
        } else {
          res.clearCookie('session-id');
          res.json({
            message: 'You are successfully logged out!'
          });
        }
      });
    } else {
      var err = new Error('You are not logged in!');
      err.status = 403;
      next(err);
    }
  });
  

module.exports = router