var express = require('express');
var router = express.Router();

var job_controller = require('../controllers/jobController');

router.get('/', job_controller.job_list);

router.get('/list/all', job_controller.job_list);
router.get('/list/', job_controller.job_list_page);
router.get('/active/all', job_controller.get_active);
router.get('/active/', job_controller.get_active_page);

router.get('/create', job_controller.job_create_get);
router.post('/create', job_controller.job_create_post);
router.get('/find_one', job_controller.job_find_one);
router.get('/:id/delete', job_controller.job_delete_get);
router.post('/:id/delete', job_controller.job_delete_post);
router.get('/:id/update', job_controller.job_update_get);
router.post('/:id/update', job_controller.job_update_post);
router.post('/:id/deactivate', job_controller.deactivate);
router.post('/:id/activate', job_controller.activate);
router.get('/:id', job_controller.job_detail);

module.exports = router;
