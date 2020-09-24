var express = require('express');
var router = express.Router();
var passport = require('passport')

var auth_controller = require('../controllers/authController')
var user_controller = require('../controllers/userController');

var requireAuth = passport.authenticate('jwt', {session: false})
var requireLogin = passport.authenticate('local', {session: false});

router.get('/list/all', user_controller.user_list);
router.post('/create/student', user_controller.user_create_student);
router.post('/create/tutor', user_controller.user_create_tutor);
router.post('/create/admin', user_controller.user_create_admin);
router.post('/delete/:id', requireAuth, user_controller.user_delete);
router.post('/update/:id', requireAuth, user_controller.user_update);
router.get('/:id', user_controller.user_detail);

module.exports = router;