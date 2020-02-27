var Job = require('../models/job');
var async = require('async');

exports.job_list = function(req, res, next) {
    Job.find()
        .exec(function(err, list_jobs) {
            if (err) {return next(err);}
            res.json(list_jobs);
        });
};

exports.job_list_page = function(req, res, next) {
    var page_limit = 10;
    var skip_num = (req.params.page-1) * page_limit;
    Job.find().skip(skip_num).limit(page_limit)
        .exec(function(err, list_jobs) {
            if (err) {return next(err);}
            res.json(list_jobs);
        });
};

exports.get_active = function(req, res, next) {
    Job.find({is_active:true})
        .exec(function(err, list_jobs) {
            if (err) {return next(err);}
            res.json(list_jobs);
        });
};

exports.get_active_page = function(req, res, next) {
    var page_limit = 10;
    var skip_num = (req.params.page-1) * page_limit;
    Job.find({"is_active":true}).skip(skip_num).limit(page_limit)
        .exec(function(err, list_jobs) {
            if (err) {return next(err);}
            res.json(list_jobs);
        });
};

exports.job_detail = function(req, res, next) {
    Job.findById(req.params.id)
        .exec(function(err, job) {
            if (err) { return next(err); }
            if (job == null) {
                var err = new Error('Job not found');
                err.status = 404;
                return next(err);
            } 
            res.json(job);
        });
};

exports.job_create_get = function(req, res, next) {
    res.send('Create GET not needed at this point');
};

exports.job_create_post = function(req, res, next) {
    var job = new Job({
        title: req.body.title,
        location: req.body.location,
        type: req.body.type,
        created_date: Date.now(),
        updated_date: Date.now(),
        description: req.body.description,
        is_active: true
    });
    job.save()
        .then(job => {
            res.status(200).json({'status': 'created successfully', 'job': job});
        })
        .catch(err => {
            res.status(400).send('creating failed');
        });
};

exports.job_delete_get = function(req, res, next) {
    res.send('Delete GET not needed at this point');
};

exports.job_delete_post = function(req, res, next) {
    Job.findByIdAndRemove(req.params.id, function deleteJob(err) {
        if (err) {return next(err);}
        res.status(200).json({'status': 'deleted successfully'});
    });
};

exports.job_update_get = function(req, res, next) {
    Job.findById(req.params.id)
        .exec(function(err, job) {
            if (err) { return next(err); }
            if (job == null) {
                var err = new Error('Job not found');
                err.status = 404;
                return next(err);
            } 
            res.json(job);
        });
};

exports.job_update_post = function(req, res, next) {
    Job.findById(req.params.id, function(err, job) {
        if (!job) {
            res.status(404).send("Job not found.");
        } else {
            job.title = req.body.title;
            job.location = req.body.location;
            job.type = req.body.type;
            job.updated_date = Date.now();
            job.description = req.body.description;

            job.save()
                .then(job => {
                    res.status(200).json({'status': 'updated successfully', 'job': job});
                })
                .catch(err => {
                    res.status(400).send('Updating failed');
                });
        }
    })
};

exports.deactivate = function(req, res, next) {
    Job.findById(req.params.id, function(err, job) {
        if (!job) {
            res.status(404).send("Job not found.");
        } else if (job.is_active == false) {
            res.status(400).send("Job already inactive.");
        } else {
            job.is_active = false;
            job.updated_date = Date.now();
            job.save()
                .then(job => {
                    res.status(200).json({'status': 'successfully deactivated', 'job': job});
                })
                .catch(err => {
                    res.status(400).send('Deactivation failed');
                });
        }
    });
};

exports.activate = function(req, res, next) {
    Job.findById(req.params.id, function(err, job) {
        if (!job) {
            res.status(404).send("Job not found.");
        } else if (job.is_active == true) {
            res.status(400).send("Job already active.");
        } else {
            job.is_active = true;
            job.updated_date = Date.now();
            job.save()
                .then(job => {
                    res.status(200).json({'status': 'successfully activated', 'job': job});
                })
                .catch(err => {
                    res.status(400).send('Activation failed');
                });
        }
    });
};
