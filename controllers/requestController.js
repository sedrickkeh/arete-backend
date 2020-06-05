var Tutor = require('../models/users');
var Request = require('../models/request');

var {success} = require('../tools/responseSender');


exports.request_list = function(req, res, next) {
    Request.find()
        .exec(function(err, list_requests) {
            if (err) {return next(err);}
            res.json(success({data:list_requests}));
        });
};

exports.request_list_active = function(req, res, next) {
    Request.find({is_active:true})
        .exec(function(err, list_requests) {
            if (err) {return next(err);}
            res.json(success({data:list_requests}));
        });
};

exports.my_requests = function(req, res, next) {
    my_role = req.user.role;

    // If user is a student
    if (my_role == "student") {
        Request.find({student:req.user._id})
            .exec(function(err, list_requests) {
                if (err) {return next(err);}
                res.json(success({data:list_requests}));
            });
    } 
    // If user is a tutor
    else { 
        Request.find({tutors_applied:req.user._id})
            .exec(function(err, list_requests) {
                if (err) {return next(err);}
                res.json(success({data:list_requests}));
            });
    }
};

exports.create_request = function(req, res, next) {
    my_role = req.user.role;
    if (my_role != "student") {
        res.status(400).send("Only students can post requests!");
    } else {
        var request = new Request();
        request.title = req.body.title;
        request.student = req.user._id;
        request.location = req.body.location;
        request.subject = req.body.subject;
        request.description = req.body.description;
        request.is_active = true;
        
        request.save()
            .then(request => {
                res.status(200).json(success({data:request}, "Create successful"));
            })
            .catch(err => {
                res.status(400).send('creating failed');
            });
    }
};

exports.delete_request = function(req, res, next) {
    Request.findByIdAndRemove(req.params.id, function deleteRequest(err) {
        if (err) {return next(err);}
        res.status(200).json(success({data:""}, "Delete successful"));
    });
};

exports.update_request = function(req, res, next) {
    Request.findById(req.params.id, function(err, request) {
        if (!request) {
            res.status(404).send("Request not found.");
        } else {
            request.title = req.body.title;
            request.location = req.body.location;
            request.subject = req.body.subject;
            request.description = req.body.description;

            request.save()
                .then(request => {
                    res.status(200).json(success({data:request}, "Update successful"));
                })
                .catch(err => {
                    res.status(400).send('Updating failed');
                });
        }
    })
};

exports.deactivate = function(req, res, next) {
    Request.findById(req.params.id, function(err, request) {
        if (!request) {
            res.status(404).send("Request not found.");
        } else if (request.is_active == false) {
            res.status(400).send("Request already inactive.");
        } else {
            request.is_active = false;
            request.save()
                .then(request => {
                    request.status(200).json(success({data:request}, "Deactivate successful"));
                })
                .catch(err => {
                    request.status(400).send('Deactivation failed');
                });
        }
    });
};

exports.activate = function(req, res, next) {
    Request.findById(req.params.id, function(err, request) {
        if (!request) {
            res.status(404).send("Request not found.");
        } else if (request.is_active == true) {
            res.status(400).send("Request already active.");
        } else {
            request.is_active = true;
            request.save()
                .then(request => {
                    request.status(200).json(success({data:request}, "Activate successful"));
                })
                .catch(err => {
                    request.status(400).send('Activation failed');
                });
        }
    });
};

exports.get_details = function(req, res, next) {
    Request.findById(req.params.id)
        .exec(function(err, request) {
            if (err) { return next(err); }
            if (request == null) {
                var err = new Error('Request not found');
                err.status = 404;
                return next(err);
            } 
            res.json(success({data:request}));
        });
};

exports.apply_for_request = function(req, res, next) {
    my_role = req.user.role;
    if (my_role != "tutor") {
        res.status(400).send("Only tutors can apply for requests!");
    } else {
        Request.findById(req.params.id, function(err, request) {
            if (!request) {
                res.status(404).send("Request not found.");
            } else if (request.tutors_applied.includes(req.user._id)) {
                res.status(400).send("Already applied for this request.");
            } else {
                request.tutors_applied.push(req.user._id)
                request.save()
                    .then(request => {
                        request.status(200).json(success({data:request}, "Application successful"));
                    })
                    .catch(err => {
                        request.status(400).send('Application failed');
                    });
            }
        });
    }
};