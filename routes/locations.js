var express = require('express');
var router = express.Router();

var location_controller = require('../controllers/locationController');

router.get('/', location_controller.location_list);

router.get('/list/all', location_controller.location_list);
router.get('/list/', location_controller.location_list_page);

router.get('/create', location_controller.location_create_get);
router.post('/create', location_controller.location_create_post);
router.get('/:id/delete', location_controller.location_delete_get);
router.post('/:id/delete', location_controller.location_delete_post);
router.get('/:id/update', location_controller.location_update_get);
router.post('/:id/update', location_controller.location_update_post);
router.get('/:id', location_controller.location_detail);

module.exports = router;
