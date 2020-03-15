var Student = require('../models/student');
var Location = require('../models/location');
var {success} = require('../tools/responseSender')
var {page} = require('../tools/pageInfo')
var async = require('async');

exports.student_list = function(req, res, next) {
    Student.find().populate('location')
        .exec(function(err, list_students) {
            if (err) {return next(err);}
            res.json(success({data:list_students}));
        });
};

exports.student_list_page = function(req, res, next) {
    var per_page = parseInt(req.query.limit) || 10;
    var page_num = parseInt(req.query.page) || 1;
    var to_skip = (page_num-1) * per_page;

    var filter = {}
    if (req.query.subject) filter["subjects"] = { "$regex": req.query.subject, "$options": "i" };
    if (req.query.location) filter["location"] = req.query.location;

    Student.find(filter)
        .populate('location')
        .skip(to_skip).limit(per_page)
        .exec(function(err, list_students) {
            Student.count(filter, function(err, doc_count) {
                if (err) {return next(err);}
                list_students_page = page(list_students, page_num, per_page, doc_count);
                res.json(success(list_students_page));
            });
        });
};

exports.student_detail = function(req, res, next) {
    Student.findById(req.params.id).populate('location')
        .exec(function(err, student) {
            if (err) { return next(err); }
            if (student == null) {
                var err = new Error('Student not found');
                err.status = 404;
                return next(err);
            } 
            res.json(success({data:student}));
        });
};

exports.student_find_one = ((req, res, next) => {
    Student.findOne().populate('location')
        .exec(function(err, student) {
            if (err) { return next(err); }
            if (student == null) {
                var err = new Error('Student not found');
                err.status = 404;
                return next(err);
            } 
            res.json(success({data:student}));
        });
});

exports.student_create_get = function(req, res, next) {
    async.parallel({
        locations: function(callback) {
            Location.find(callback);
        }
    }, function(err, results) {
        if (err) {return next(err);}
        res.json(success(results.locations));
    });
};

exports.student_create_post = function(req, res, next) {
    var student = new Student(req.body);
    student.save()
        .then(student => {
            res.status(200).json(success({data:student}, "Create successful"));
        })
        .catch(err => {
            res.status(400).send('creating failed');
        });
};

exports.student_delete_get = function(req, res, next) {
    res.send('Delete GET not needed at this point');
};

exports.student_delete_post = function(req, res, next) {
    Student.findByIdAndRemove(req.params.id, function deleteStudent(err) {
        if (err) {return next(err);}
        res.status(200).json(success({data:""}, "Delete successful"));
    });
};

exports.student_update_get = function(req, res, next) {
    Student.findById(req.params.id)
        .exec(function(err, student) {
            if (err) { return next(err); }
            if (student == null) {
                var err = new Error('Student not found');
                err.status = 404;
                return next(err);
            } 
            res.json(success({data:student}));
        });
};

exports.student_update_post = function(req, res, next) {
    Student.findById(req.params.id, function(err, student) {
        if (!student) {
            res.status(404).send("Student not found.");
        } else {
            student.name = req.body.name;
            student.gender = req.body.gender;
            student.email = req.body.email;
            student.school = req.body.school;
            student.year = req.body.year;
            student.contact_number = req.body.contact_number;
            student.subjects = req.body.subjects;
            student.preference = req.body.preference;
            student.location = req.body.location;
            student.hourly_rate =req.body.hourly_rate;
            student.description = req.body.description;

            student.save()
                .then(student => {
                    res.status(200).json(success({data:student}, "Update successful"));
                })
                .catch(err => {
                    res.status(400).send('Updating failed');
                });
        }
    })
};

