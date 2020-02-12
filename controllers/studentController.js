var Student = require('../models/student');

var async = require('async');


exports.student_list = function(req, res, next) {
    Student.find()
        .exec(function(err, list_students) {
            if (err) {return next(err);}
            res.json(list_students);
        });
};

exports.student_detail = function(req, res, next) {
    Student.findById(req.params.id)
        .exec(function(err, student) {
            if (err) { return next(err); }
            if (student == null) {
                var err = new Error('Student not found');
                err.status = 404;
                return next(err);
            } 
            res.json(student);
        });
};

exports.student_create_get = function(req, res, next) {
    res.send('Create GET not needed at this point');
};

exports.student_create_post = function(req, res, next) {
    var student = new Student(req.body);
    student.save()
        .then(student => {
            res.status(200).json({'status': 'created successfully', 'student': student});
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
        res.status(200).json({'status': 'deleted successfully'});
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
            res.json(student);
        });
};

exports.student_update_post = function(req, res, next) {
    Student.findById(req.params.id, function(err, student) {
        if (!student) {
            res.status(404).send("Student not found.");
        } else {
            student.name = req.body.name;
            student.gender = req.body.gender;
            student.secondary.school = req.body.secondary.school;
            student.secondary.curriculum = req.body.secondary.curriculum;
            student.secondary.year = req.body.secondary.year;
            student.phone_number = req.body.phone_number;
            student.lessons.subjects = req.body.lessons.subjects;
            student.lessons.location = req.body.lessons.location;

            student.save()
                .then(student => {
                    res.status(200).json({'status': 'updated successfully', 'student': student});
                })
                .catch(err => {
                    res.status(400).send('Updating failed');
                });
        }
    })
};

