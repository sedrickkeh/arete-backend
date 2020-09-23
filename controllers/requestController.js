var Tutor = require('../models/profile');
var Request = require('../models/request');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var {success} = require('../tools/responseSender');

exports.list_all = function(req, res, next) {
    Request.find()
        .populate('student')
        .populate('tutor')
        .exec(function(err, list_requests) {
            if (err) {return next(err);}
            res.json(success({data:list_requests}));
        });
};

exports.list_pending = function(req, res, next) {
    Request.find({status:"pending"})
        .populate('student')
        .populate('tutor')
        .exec(function(err, list_requests) {
            if (err) {return next(err);}
            res.json(success({data:list_requests}));
        });
};

exports.list_accepted = function(req, res, next) {
    Request.find({status:"accepted"})
        .populate('student')
        .populate('tutor')
        .exec(function(err, list_requests) {
            if (err) {return next(err);}
            res.json(success({data:list_requests}));
        });
};

exports.list_completed = function(req, res, next) {
    Request.find({status:"completed"})
        .populate('student')
        .populate('tutor')
        .exec(function(err, list_requests) {
            if (err) {return next(err);}
            res.json(success({data:list_requests}));
        });
};

exports.student_requests = function(req, res, next) {
    Request.find({student:req.user.profile_id})
        .exec((err, list_requests) => {
            if (err) {return next(err);}
            res.json(success({data:list_requests}));
        });
};

exports.tutor_requests = function(req, res, next) {
    Request.find({tutor:req.user.profile_id})
        .exec((err, list_requests) => {
            if (err) {return next(err);}
            res.json(success({data:list_requests}));
        });
};

exports.find_request = function(req, res, next) {
    Request.findById(req.params.id)
        .exec(function(err, request) {
            if (err) { return next(err); }
            if (request == null) {
                var err = new Error('Request not found');
                err.status = 404;
                return next(err);
            } else if (req.user.profile_id != request.student && req.user.profile_id != request.tutor && req.user.role != "admin") {
                var err = new Error('Cannot access this resource.');
                err.status = 403;
                return next(err);
            } else {
                res.json(success({data:request}));
            }
        });
};


exports.create_request = function(req, res, next) {
    var request = new Request()
    request.student = mongoose.Types.ObjectId(req.user.profile_id);
    request.tutor = mongoose.Types.ObjectId(req.params.id);
    request.status = "pending";
    request.subject = req.body.subject;

    request.save()
        .then(request => {
            res.status(200).json(success({data:request}));
        })
        .catch(err => {
            res.status(400).send('creating failed');
    });
};


exports.set_pending = function(req, res, next) {
    Request.findById(req.params.id, function(err, request) {
        if (!request) {
            res.status(404).send("Request not found.");
        } else {
            request.status = "pending";
            request.save()
                .then(request => {
                    res.status(200).json(success({data:request}, "Set to pending SUCCESS"));
                })
                .catch(err => {
                    res.status(400).send('Set to pending FAILED');
                });
        }
    })
};

exports.set_accepted = function(req, res, next) {
    Request.findById(req.params.id, function(err, request) {
        if (!request) {
            res.status(404).send("Request not found.");
        } else {
            request.status = "accepted";
            request.save()
                .then(request => {
                    res.status(200).json(success({data:request}, "Set to accepted SUCCESS"));
                })
                .catch(err => {
                    res.status(400).send('Set to accepted FAILED');
                });
        }
    })
};

exports.set_completed = function(req, res, next) {
    Request.findById(req.params.id, function(err, request) {
        if (!request) {
            res.status(404).send("Request not found.");
        } else {
            request.status = "completed";
            request.save()
                .then(request => {
                    res.status(200).json(success({data:request}, "Set to completed SUCCESS"));
                })
                .catch(err => {
                    res.status(400).send('Set to completed FAILED');
                });
        }
    })
};