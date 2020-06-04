var express = require('express');
var router = express.Router();
var passport = require('passport');

var rating_controller = require('../controllers/ratingController');

var requireAuth = passport.authenticate('jwt', {session: false});
var requireLogin = passport.authenticate('local', {session: false});

router.get('/given', requireAuth, rating_controller.ratings_given);
router.get('/received/:id', rating_controller.ratings_received);

router.post('/rate/:id', requireAuth, rating_controller.tutor_rate_post);


module.exports = router;
