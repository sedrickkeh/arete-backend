var express = require('express');
var router = express.Router();
var passport = require('passport')
var passportService = require('../configs/passport')
var auth_controller = require('../controllers/authController');
var user_controller = require('../controllers/userController');

var requireAuth = passport.authenticate('jwt', {session: false})
var requireLogin = passport.authenticate('local', {session: false});

router.get('/', requireAuth, auth_controller.login_status);
router.post('/login', requireLogin, auth_controller.login);

router.post('/register/student', user_controller.user_create_student);
router.post('/register/tutor', user_controller.user_create_tutor);
router.post('/register/admin', user_controller.user_create_admin);

module.exports = router;
