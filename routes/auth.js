var express = require('express');
var router = express.Router();
var passport = require('passport')
var passportService = require('../configs/passport')
var auth_controller = require('../controllers/authController');
var tutor_controller = require('../controllers/tutorController');
var student_controller = require('../controllers/studentController');

var requireAuth = passport.authenticate('jwt', {session: false})
var requireLogin = passport.authenticate('local', {session: false});


router.post('/login', requireLogin, auth_controller.login);

router.post('/register/student', student_controller.student_create_post);
router.post('/register/tutor', tutor_controller.tutor_create_post);

module.exports = router;
