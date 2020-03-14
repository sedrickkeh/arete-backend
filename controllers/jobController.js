var Job = require('../models/job');
var {success} = require('../tools/responseSender')
var {page} = require('../tools/pageInfo')

exports.job_list = function(req, res, next) {
    Job.find()
        .exec(function(err, list_jobs) {
            if (err) {return next(err);}
            res.json(success({data:list_jobs}));
        });
};

exports.job_list_page = function(req, res, next) {
    var per_page = parseInt(req.query.limit) || 10;
    var page_num = parseInt(req.query.page) || 1;
    var to_skip = (page_num-1) * per_page;
    Job.find().skip(to_skip).limit(per_page)
        .exec(function(err, list_jobs) {
            if (err) {return next(err);}
            list_jobs_page = page(list_jobs, page_num, per_page);
            res.json(success(list_jobs_page));
        });
};

exports.get_active = function(req, res, next) {
    Job.find({is_active:true})
        .exec(function(err, list_jobs) {
            if (err) {return next(err);}
            res.json(success({data:list_jobs}));
        });
};

exports.get_active_page = function(req, res, next) {
    var per_page = parseInt(req.query.limit) || 10;
    var page_num = parseInt(req.query.page) || 1;
    var to_skip = (page_num-1) * per_page;
    Job.find({"is_active":true}).skip(to_skip).limit(per_page)
        .exec(function(err, list_jobs) {
            if (err) {return next(err);}
            list_jobs_page = page(list_jobs, page_num, per_page);
            res.json(success(list_jobs_page));
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
            res.json(success({data:job}));
        });
};

exports.job_find_one = function(req, res, next) {
    Job.findOne()
        .exec(function(err, job) {
            if (err) { return next(err); }
            if (job == null) {
                var err = new Error('Job not found');
                err.status = 404;
                return next(err);
            } 
            res.json(success({data:job}));
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
            res.status(200).json(success({data:job}, "Create successful"));
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
        res.status(200).json(success({data:""}, "Delete successful"));
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
            res.json(success({data:job}));
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
                    res.status(200).json(success({data:job}, "Update successful"));
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
                    res.status(200).json(success({data:job}, "Deactivate successful"));
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
                    res.status(200).json(success({data:job}, "Activate successful"));
                })
                .catch(err => {
                    res.status(400).send('Activation failed');
                });
        }
    });
};
