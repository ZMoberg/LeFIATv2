const passport = require('passport');
const User = require("../models/user")
const { isLoggedIn, currentUser, isAdmin } = require('../controllers/permission')


const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('users/register')
})

router.post('/', async (req,res, next) => {
    try {
        User.register( new User({
        username: req.body.username
      }),
        req.body.password, (err, user) => {
          console.log(user)
        if (err) {
            console.log(err)
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({
            err: err
          });
        } else {
             passport.authenticate('local')(req, res, () => {
            User.findOne({
              username: req.body.username
            }, (err, person) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json({
                success: true,
                status: 'Registration Successful!',
              });
            });
          })
        }
      })
    } catch(err) {
        console.log("error", err)
    }
})



module.exports = router