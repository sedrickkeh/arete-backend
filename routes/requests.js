var express = require('express');
var router = express.Router();
var passport = require('passport');

var request_controller = require('../controllers/requestController');
var auth_controller = require('../controllers/authController')

var requireAuth = passport.authenticate('jwt', {session: false});
var requireLogin = passport.authenticate('local', {session: false});


router.get('/list/all', requireAuth, auth_controller.roleAuth(['admin']), request_controller.list_all);
router.get('/list/pending', requireAuth, auth_controller.roleAuth(['admin']), request_controller.list_pending);
router.get('/list/accepted', requireAuth, auth_controller.roleAuth(['admin']), request_controller.list_accepted);
router.get('/list/completed', requireAuth, auth_controller.roleAuth(['admin']), request_controller.list_completed);
router.get('/list/tutor/my_requests', requireAuth, auth_controller.roleAuth(['tutor']), request_controller.tutor_requests);
router.get('/list/student/my_requests', requireAuth, auth_controller.roleAuth(['student']), request_controller.student_requests);
router.get('/find/:id', requireAuth, auth_controller.roleAuth(['student', 'tutor', 'admin']), request_controller.find_request);

router.post('/create/:id', requireAuth, auth_controller.roleAuth(['student', 'admin']), request_controller.create_request);
router.post('/set/pending/:id', requireAuth, auth_controller.roleAuth(['admin']), request_controller.set_pending);
router.post('/set/accepted/:id', requireAuth, auth_controller.roleAuth(['admin']), request_controller.set_accepted);
router.post('/set/completed/:id', requireAuth, auth_controller.roleAuth(['admin']), request_controller.set_completed);


module.exports = router;
