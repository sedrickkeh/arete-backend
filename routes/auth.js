var express = require('express');
var router = express.Router();
var passport = require('passport')
var passportService = require('../configs/passport')
var auth_controller = require('../controllers/authController');

var requireAuth = passport.authenticate('jwt', {session: false})
var requireLogin = passport.authenticate('local', {session: false});


router.post('/login', requireLogin, auth_controller.login);

// For register, check the student and tutor routes "POST /create".
// router.get('/register', auth_controller.register);

module.exports = router;
