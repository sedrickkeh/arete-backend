var Tutor = require('../models/profile');
var Rating = require('../models/rating');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var {success} = require('../tools/responseSender');
const { schema } = require('../models/profile');


exports.ratings_given = function(req, res, next) {
    Rating.find({student:req.user.profile_id})
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


exports.make_rating = function(req, res, next) {
    var rating = new Rating()
    rating.student = mongoose.Types.ObjectId(req.user.profile_id);
    rating.tutor = mongoose.Types.ObjectId(req.params.id);
    rating.score = req.body.score;
    rating.comments = req.body.comments;

    Rating.findOne({student: rating.student, tutor:rating.tutor}, (err, rat) => {
        if(err) { return next(err);} 
        else if (rat) { res.status(400).send('Rating already exists');}
        else {
            Tutor.findOne({_id: rating.tutor})
            .exec(function(err, tut) {
                // Update Score
                if (rating.score == 1) tut.num_ones += 1; 
                else if (rating.score == 2) tut.num_twos += 1;
                else if (rating.score == 3) tut.num_threes += 1;
                else if (rating.score == 4) tut.num_fours += 1;
                else if (rating.score == 5) tut.num_fives += 1;
                tut.num_reviews += 1;
                var total_score = tut.num_ones + 2*tut.num_twos + 3*tut.num_threes + 4*tut.num_fours + 5*tut.num_fives;
                tut.average_rating = (total_score) / tut.num_reviews;
                tut.save();
                
                rating.save()
                    .then(rating => {
                        res.status(200).json(success({data:rating}));
                    })
                    .catch(err => {
                        res.status(400).send('creating failed');
                    });
            });

            
        }
    });

};
