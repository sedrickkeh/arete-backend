var express = require('express');
var router = express.Router();
var passport = require('passport');

var request_controller = require('../controllers/requestController');

var requireAuth = passport.authenticate('jwt', {session: false});
var requireLogin = passport.authenticate('local', {session: false});

router.get('/list', request_controller.request_list);
router.get('/list/active', request_controller.request_list_active);
router.get('/list/my_requests', requireAuth, request_controller.my_requests);

router.post('/create', requireAuth, request_controller.create_request);
router.post('/delete/:id', requireAuth, request_controller.delete_request);
router.post('/update/:id', requireAuth, request_controller.update_request);
router.post('/deactivate/:id', requireAuth, request_controller.deactivate);
router.post('/activate/:id', requireAuth, request_controller.activate);
router.get('/:id', request_controller.get_details);

router.post('/apply/:id', requireAuth, request_controller.apply_for_request);

module.exports = router;
