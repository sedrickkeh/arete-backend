var Tutor = require('../models/tutor');
var Student = require('../models/student');

var async = require('async');

exports.index = function(req, res, next) {
    res.send('NOT IMPLEMENTED');
};

exports.tutor_list = function(req, res, next) {
    Tutor.find()
        .exec(function(err, list_tutors) {
            if (err) {return next(err);}
            res.json(list_tutors);
        });
};

exports.tutor_detail = function(req, res, next) {
    Tutor.findById(req.params.id)
        .exec(function(err, tutor) {
            if (err) { return next(err); }
            if (tutor == null) {
                var err = new Error('Tutor not found');
                err.status = 404;
                return next(err);
            } 
            res.json(tutor);
        });
};

exports.tutor_create_get = function(req, res, next) {
    res.send('Create GET not needed at this point');
};

exports.tutor_create_post = function(req, res, next) {
    var tutor = new Tutor(req.body);
    tutor.save()
        .then(tutor => {
            res.status(200).json({'status': 'created successfully', 'tutor': req.body});
        })
        .catch(err => {
            res.status(400).send('creating failed');
        });
};

exports.tutor_delete_get = function(req, res, next) {
    res.send('Delete GET not needed at this point');
};

exports.tutor_delete_post = function(req, res, next) {
    Tutor.findByIdAndRemove(req.params.id, function deleteTutor(err) {
        if (err) {return next(err);}
        res.status(200).json({'status': 'deleted successfully'});
    });
};

exports.tutor_update_get = function(req, res, next) {
    Tutor.findById(req.params.id)
        .exec(function(err, tutor) {
            if (err) { return next(err); }
            if (tutor == null) {
                var err = new Error('Tutor not found');
                err.status = 404;
                return next(err);
            } 
            res.json(tutor);
        });
};

exports.tutor_update_post = function(req, res, next) {
    Tutor.findById(req.params.id, function(err, tutor) {
        if (!tutor) {
            res.status(404).send("Tutor not found.");
        } else {
            tutor.name = req.body.name;
            tutor.gender = req.body.gender;
            tutor.university = req.body.university;
            tutor.secondary.school = req.body.secondary.school;
            tutor.secondary.curriculum = req.body.secondary.curriculum;
            tutor.secondary.score = req.body.secondary.score;
            tutor.phone_number = req.body.phone_number;
            tutor.lessons.subjects = req.body.lessons.subjects;
            tutor.lessons.location = req.body.lessons.location;
            tutor.lessons.time = req.body.lessons.time;

            tutor.save()
                .then(tutor => {
                    res.status(200).json({'status': 'updated successfully', 'tutor': tutor});
                })
                .catch(err => {
                    res.status(400).send('Updating failed');
                });
        }
    })
};

