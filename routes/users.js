var express = require('express');
var router = express.Router();

var tutor_controller = require('../controllers/tutorController');
var student_controller = require('../controllers/studentController');

router.get('/', tutor_controller.index);

// Tutor Routes
var tutorRoutes = express.Router()
router.use('/tutor', tutorRoutes);
tutorRoutes.get('/list/all', requireAuth, tutor_controller.tutor_list);
tutorRoutes.get('/list/', tutor_controller.tutor_list_page);
tutorRoutes.get('/create', tutor_controller.tutor_create_get);
tutorRoutes.post('/create', tutor_controller.tutor_create_post);
tutorRoutes.get('/find_one', tutor_controller.tutor_find_one);
tutorRoutes.get('/:id/delete', tutor_controller.tutor_delete_get);
tutorRoutes.post('/:id/delete', tutor_controller.tutor_delete_post);
tutorRoutes.get('/:id/update', tutor_controller.tutor_update_get);
tutorRoutes.post('/:id/update', tutor_controller.tutor_update_post);
tutorRoutes.get('/:id', tutor_controller.tutor_detail);


// Student Routes
var studentRoutes = express.Router()
router.use('/student', studentRoutes);
studentRoutes.get('/list/all', student_controller.student_list);
studentRoutes.get('/list/', student_controller.student_list_page);
studentRoutes.get('/create', student_controller.student_create_get);
studentRoutes.post('/create', student_controller.student_create_post);
studentRoutes.get('/find_one', student_controller.student_find_one);
studentRoutes.get('/:id/delete', student_controller.student_delete_get);
studentRoutes.post('/:id/delete', student_controller.student_delete_post);
studentRoutes.get('/:id/update', student_controller.student_update_get);
studentRoutes.post('/:id/update', student_controller.student_update_post);
studentRoutes.get('/:id', student_controller.student_detail);

module.exports = router;
