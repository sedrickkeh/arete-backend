var Student = require('../models/users');
var Location = require('../models/location');
var idschema = require('../tools/idSchema');
var {success} = require('../tools/responseSender')
var {page} = require('../tools/pageInfo')
var {setUserInfo, generateToken} = require('./authController')
var async = require('async');

exports.student_list = function(req, res, next) {
    Student.find({role:"student"}).populate('location')
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
    filter["role"] = "student";
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
    Student.findOne({role:"student"}).populate('location')
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
    var student = new Student();

    // Login Info
    student.email = req.body.email;
    student.password = req.body.password;
    student.role = "student"

    // General Info
    student.title = req.body.title;
    student.name = req.body.name;
    student.pref_name = req.body.pref_name;
    student.gender = req.body.gender;
    student.age = req.body.age;
    student.contact_number = req.body.contact_number;

    // Learning-related Info
    student.location = req.body.location;
    student.hourly_rate = req.body.hourly_rate;
    student.preference = req.body.preference;
    student.subjects = req.body.subjects;
    student.time = req.body.time;

    // Student-specific Info
    student.contact.title = req.body.contact.title;
    student.contact.name = req.body.contact.name;
    student.contact.contact_number = req.body.contact.contact_number;
    student.contact.email = req.body.contact.email;
    student.contact.relationship = req.body.contact.relationship;
    student.school = req.body.school
    student.year = req.body.year
    student.examination_student = req.body.examination_student
    student.description = req.body.description

    // Check missing fields
    if(!student.email) {return res.status(422).send({error: 'You must enter an email address'});}
    if(!student.password) {return res.status(422).send({error: 'You must enter a password'});}

    Student.findOne({email: student.email}, function(err, existingUser){
        if(err) {return next(err);}
        if(existingUser) {return res.status(422).send({error: 'That email address is already in use'});}

        idschema.find({name:"Student"})
        .exec(function(err, studentcntr) {
            studentcntr[0].count += 1;
            studentcntr[0].save()
            student.user_id = studentcntr[0].count;
            student.save(function(err, user) {
                if (err) {return next(err);}
                var userInfo = setUserInfo(user);
                res.status(201).json({
                    token: 'JWT ' + generateToken(userInfo),
                    user: userInfo
                })
            })
        });
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
            // Login Info
            student.email = req.body.email;
            student.password = req.body.password;

            // General Info
            student.title = req.body.title;
            student.name = req.body.name;
            student.pref_name = req.body.pref_name;
            student.gender = req.body.gender;
            student.age = req.body.age;
            student.contact_number = req.body.contact_number;

            // Learning-related Info
            student.location = req.body.location;
            student.hourly_rate = req.body.hourly_rate;
            student.preference = req.body.preference;
            student.subjects = req.body.subjects;
            student.time = req.body.time;

            // Student-specific Info
            student.contact.title = req.body.contact.title;
            student.contact.name = req.body.contact.name;
            student.contact.contact_number = req.body.contact.contact_number;
            student.contact.email = req.body.contact.email;
            student.contact.relationship = req.body.contact.relationship;
            student.school = req.body.school
            student.year = req.body.year
            student.examination_student = req.body.examination_student
            student.description = req.body.description


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

