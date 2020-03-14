var Student = require('../models/student');
var {success} = require('../tools/responseSender')
var {page} = require('../tools/pageInfo')

exports.student_list = function(req, res, next) {
    Student.find()
        .exec(function(err, list_students) {
            if (err) {return next(err);}
            res.json(success({data:list_students}));
        });
};

exports.student_list_page = function(req, res, next) {
    var per_page = parseInt(req.query.limit) || 10;
    var page_num = parseInt(req.query.page) || 1;
    var to_skip = (page_num-1) * per_page;
    Student.find().skip(to_skip).limit(per_page)
        .exec(function(err, list_students) {
            if (err) {return next(err);}
            list_students_page = page(list_students, page_num, per_page);
            res.json(success(list_students_page));
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
            res.json(success({data:student}));
        });
};

exports.student_find_one = ((req, res, next) => {
    Student.findOne()
        .exec(function(err, student) {
            if (err) { return next(err); }
            if (student == null) {
                var err = new Error('Tutor not found');
                err.status = 404;
                return next(err);
            } 
            res.json(success({data:student}));
        });
});

exports.student_create_get = function(req, res, next) {
    res.send('Create GET not needed at this point');
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
            student.secondary.school = req.body.secondary.school;
            student.secondary.curriculum = req.body.secondary.curriculum;
            student.secondary.year = req.body.secondary.year;
            student.phone_number = req.body.phone_number;
            student.lessons.subjects = req.body.lessons.subjects;
            student.lessons.location = req.body.lessons.location;
            student.lessons.max_wage = req.body.lessons.max_wage;
            student.description_of_needs = req.body.description_of_needs;

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

