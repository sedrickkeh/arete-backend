var User = require('../models/users');
var idschema = require('../tools/idSchema');
var {success} = require('../tools/responseSender')
var {page} = require('../tools/pageInfo')
var {setUserInfo, generateToken} = require('./authController')
var async = require('async');

exports.user_list = function(req, res, next) {
    User.find()
        .exec(function(err, list_users) {
            if (err) {return next(err);}
            res.json(success({data:list_users}));
        });
};

exports.user_create_student = function(req, res, next) {
    var student = new User();

    // Login Info
    student.email = req.body.email;
    student.password1 = req.body.password1;
    student.password2 = req.body.password2;
    student.role = "student"

    // Name
    student.name = req.body.name;

    // Check missing fields
    if(!student.email) {return res.status(422).send({error: 'You must enter an email address'});}
    if(!student.password1) {return res.status(422).send({error: 'You must enter a password'});}
    if(!student.password2) {return res.status(422).send({error: 'You must confirm your password'})}
    if(student.password1 !== student.password2) {return res.status(422).send({error: 'Passwords do not match'})}
    if(!student.name) {return res.status(422).send({error: 'You must enter a name'});}

    User.findOne({email: student.email}, function(err, existingUser){
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


exports.user_create_tutor = function(req, res, next) {
    var tutor = new User();

    // Login Info
    tutor.email = req.body.email;
    tutor.password1 = req.body.password1;
    tutor.password2 = req.body.password2;
    tutor.role = "tutor"

    // Name
    tutor.name = req.body.name;
   

    // Check missing fields
    if(!tutor.email) {return res.status(422).send({error: 'You must enter an email address'});}
    if(!tutor.password1) {return res.status(422).send({error: 'You must enter a password'});}
    if(!tutor.password2) {return res.status(422).send({error: 'You must confirm your password'})}
    if(tutor.password1 !== tutor.password2) {return res.status(422).send({error: 'Passwords do not match'})}
    if(!tutor.name) {return res.status(422).send({error: 'You must enter a name'});}

    User.findOne({email: tutor.email}, function(err, existingUser){
        if(err) {return next(err);}
        if(existingUser) {return res.status(422).send({error: 'That email address is already in use'});}

        idschema.find({name:"Tutor"})
        .exec(function(err, tutorcntr) {
            tutorcntr[0].count += 1;
            tutorcntr[0].save()
            tutor.user_id = tutorcntr[0].count;
            tutor.save(function(err, user) {
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

exports.user_delete = function(req, res, next) {
    User.findByIdAndRemove(req.params.id, function deleteUser(err) {
        if (err) {return next(err);}
        res.status(200).json(success({data:""}, "Delete successful"));
    });
};


exports.user_update = function(req, res, next) {
    User.findById(req.params.id, function(err, user) {
        if (!user) {
            res.status(404).send("User not found.");
        } else if (String(user._id) != String(req.user._id) && req.user.role != "admin") {
            res.status(401).send("Not authorized to do this action.");
        } else {
            // General Info
            if (req.body.name) user.name = req.body.name;

            // Login Info
            // **************** TODO *********************
            //
            // Allow changing email and password.
            //
            // *******************************************

            user.save()
                .then(user => {
                    res.status(200).json(success({data:user}, "Update successful"));
                })
                .catch(err => {
                    res.status(400).send('Updating failed');
                });
        }
    })
};

exports.user_detail = function(req, res, next) {
    User.findById(req.params.id)
        .exec(function(err, user) {
            if (err) { return next(err); }
            if (user == null) {
                var err = new Error('User not found');
                err.status = 404;
                return next(err);
            } 
            res.json(success({data:user}));
        });
};

