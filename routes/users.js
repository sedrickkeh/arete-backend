var express = require('express');
var router = express.Router();

var tutor_controller = require('../controllers/tutorController');
var student_controller = require('../controllers/studentController');

router.get('/', tutor_controller.index);

router.get('/tutor/list', tutor_controller.tutor_list);
router.get('/tutor/list/:page', tutor_controller.tutor_list_page);
router.get('/tutor/create', tutor_controller.tutor_create_get);
router.post('/tutor/create', tutor_controller.tutor_create_post);
router.get('/tutor/:id/delete', tutor_controller.tutor_delete_get);
router.post('/tutor/:id/delete', tutor_controller.tutor_delete_post);
router.get('/tutor/:id/update', tutor_controller.tutor_update_get);
router.post('/tutor/:id/update', tutor_controller.tutor_update_post);
router.get('/tutor/:id', tutor_controller.tutor_detail);

router.get('/student/list', student_controller.student_list);
router.get('/student/list/:page', student_controller.student_list_page);
router.get('/student/create', student_controller.student_create_get);
router.post('/student/create', student_controller.student_create_post);
router.get('/student/:id/delete', student_controller.student_delete_get);
router.post('/student/:id/delete', student_controller.student_delete_post);
router.get('/student/:id/update', student_controller.student_update_get);
router.post('/student/:id/update', student_controller.student_update_post);
router.get('/student/:id', student_controller.student_detail);

module.exports = router;
