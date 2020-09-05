var Tutor = require('../models/users');
var Rating = require('../models/rating');

var {success} = require('../tools/responseSender');


exports.ratings_given = function(req, res, next) {
    Rating.find({student:req.user._id})
        .populate('student')
        .populate('tutor')
        .exec((err, list_ratings) => {
            if (err) {return next(err);}
            res.json(success({data:list_ratings}));
        });
};

exports.ratings_received = function(req, res, next) {
    // Ensure that id being searched is a tutor

    Rating.find({tutor:req.params.id})
        .populate('student')
        .populate('tutor')
        .exec((err, list_ratings) => {
            if (err) {return next(err);}
            res.json(success({data:list_ratings}));
        });
};


exports.tutor_rate_post = function(req, res, next) {
    var rating = new Rating()
    rating.student = req.user._id;
    rating.tutor = req.params.id;
    rating.score = req.body.score;
    rating.comments = req.body.comments;

    Rating.findOne({student: rating.student, tutor:rating.tutor}, (err, rat) => {
        if(err) { return next(err);} 
        else if (rat) { res.status(400).send('Rating already exists');}
        else {
            rating.save()
            .then(rating => {
                res.status(200).json(success({data:rating}));
            })
            .catch(err => {
                res.status(400).send('creating failed');
            });
        }
    });

    // Update tutor score count and average scores
};
