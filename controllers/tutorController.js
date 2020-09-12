var User = require('../models/users');
var Tutor = require('../models/profile');
var Location = require('../models/location');
var idschema = require('../tools/idSchema');
var multer = require('multer');
var {success} = require('../tools/responseSender')
var {page} = require('../tools/pageInfo')
var {setUserInfo, generateToken} = require('./authController')
var async = require('async');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './images/');
    },

    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + file.originalname)
    }
});

var imageFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('You can upload only image files!'), false);
    }
    cb(null, true);
};

const upload = multer({ 
    storage: storage, 
    limits: {fileSize: 1024 * 1024 * 5}, 
    fileFilter: imageFileFilter
});

exports.index = ((req, res, next) => {
    res.send('NOT IMPLEMENTED');
});

exports.tutor_list = ((req, res, next) => {
    Tutor.find({role:"tutor"}).populate('location')
        .exec(function(err, list_tutors) {
            if (err) {return next(err);}
            res.json(success({data:list_tutors}));
        });
});

exports.tutor_list_page = ((req, res, next) => {
    var per_page = parseInt(req.query.limit) || 10;
    var page_num = parseInt(req.query.page) || 1;
    var to_skip = (page_num-1) * per_page;

    var filter = {}
    filter["role"] = "tutor";
    if (req.query.subject) filter["subjects"] = { "$regex": req.query.subject, "$options": "i" };
    if (req.query.name) filter["name"] = { "$regex": req.query.name, "$options": "i" };
    if (req.query.location) filter["location"] = req.query.location;

    Tutor.find(filter).populate('location')
        .skip(to_skip).limit(per_page)
        .exec(function(err, list_tutors) {
            Tutor.count(filter, function(err, doc_count) {
                if (err) {return next(err);}
                list_tutors_page = page(list_tutors, page_num, per_page, doc_count);
                res.json(success(list_tutors_page));
            });
        });
});

exports.tutor_detail = ((req, res, next) => {
    Tutor.findById(req.params.id).populate('location')
        .exec(function(err, tutor) {
            if (err) { return next(err); }
            if (tutor == null) {
                var err = new Error('Tutor not found');
                err.status = 404;
                return next(err);
            } 
            res.json(success({data:tutor}));
        });
});

exports.tutor_find_one = ((req, res, next) => {
    Tutor.findOne({role:"tutor"}).populate('location')
        .exec(function(err, tutor) {
            if (err) { return next(err); }
            if (tutor == null) {
                var err = new Error('Tutor not found');
                err.status = 404;
                return next(err);
            } 
            res.json(success({data:tutor}));
        });
});

exports.tutor_create_get = (req, res, next) => {
    async.parallel({
        locations: function(callback) {
            Location.find(callback);
        }
    }, function(err, results) {
        if (err) {return next(err);}
        res.json(success(results.locations));
    });
};

exports.tutor_create_post = ((req, res, next) =>{
    var tutor = new Tutor();

    // Login Info
    tutor.user = req.user._id;
    tutor.role = "tutor";
    tutor.name = req.user.name;
    tutor.email = req.user.email;

    // General Info
    tutor.title = req.body.title;
    tutor.pref_name = req.body.pref_name;
    tutor.gender = req.body.gender;
    tutor.birth_year = req.body.birth_year;
    tutor.contact_number = req.body.contact_number;

    // Learning-related Info
    tutor.location = req.body.location;
    tutor.hourly_rate = req.body.hourly_rate;
    tutor.preference = req.body.preference;
    tutor.subjects = req.body.subjects;
    tutor.time = req.body.time;

    // Tutor-specific Info
    tutor.examination_tutor = req.body.examination_tutor;
    tutor.overall_score = req.body.overall_score;
    tutor.detailed_scores = req.body.detailed_scores;
    tutor.experience = req.body.experience;
    tutor.licensed = req.body.licensed;
    tutor.university_name = req.body.university_name;
    tutor.university_program = req.body.university_program;
    tutor.self_introduction = req.body.self_introduction;


    User.findOne({_id: req.user._id}, function(err, existingUser){
        if(err) {return next(err);}
        if(!existingUser) {return res.status(404).send({error: 'No such user!'});}

    tutor.save()
        .then(tutor => {
            existingUser.profile_id = tutor._id;
            existingUser.save();
            res.status(200).json(success({data:tutor}));
        })
        .catch(err => {
            res.status(400).send('creating failed');
        });
});
});


exports.tutor_delete_get = ((req, res, next) => {
    res.send('Delete GET not needed at this point');
});

exports.tutor_delete_post = ((req, res, next) => {
    Tutor.findByIdAndRemove(req.params.id, function deleteTutor(err) {
        if (err) {return next(err);}
        res.status(200).json(success({data:""}, "Delete successful"));
    });
});

exports.tutor_update_get = ((req, res, next) => {
    Tutor.findById(req.params.id)
        .exec(function(err, tutor) {
            if (err) { return next(err); }
            if (tutor == null) {
                var err = new Error('Tutor not found');
                err.status = 404;
                return next(err);
            } 
            res.json(success({data:tutor}));
        });
});

exports.tutor_update_post = (upload.single('tutorImage'), (req, res, next) => {
    Tutor.findById(req.params.id, function(err, tutor) {
        if (!tutor) {
            res.status(404).send("Tutor not found.");
        } else if (String(tutor.user._id) != String(req.user._id) && req.user.role != "admin") {
            res.status(401).send("Not authorized to do this action.");
        } else {
            // Login Info
            // Login info can be changed in user update.
            tutor.name = req.user.name;
            tutor.email = req.user.email;

            // General Info
            if (req.body.title) tutor.title = req.body.title;
            if (req.body.pref_name) tutor.pref_name = req.body.pref_name;
            if (req.body.gender) tutor.gender = req.body.gender;
            if (req.body.birth_year) tutor.birth_year = req.body.birth_year;
            if (req.body.contact_number) tutor.contact_number = req.body.contact_number;

            // Learning-related Info
            if (req.body.location) tutor.location = req.body.location;
            if (req.body.hourly_rate) tutor.hourly_rate = req.body.hourly_rate;
            if (req.body.preference) tutor.preference = req.body.preference;
            if (req.body.subjects) tutor.subjects = req.body.subjects;
            if (req.body.time) tutor.time = req.body.time;

            // Tutor-specific Info
            if (req.body.examination_tutor) tutor.examination_tutor = req.body.examination_tutor;
            if (req.body.overall_score) tutor.overall_score = req.body.overall_score;
            if (req.body.detailed_scores) tutor.detailed_scores = req.body.detailed_scores;
            if (req.body.experience) tutor.experience = req.body.experience;
            if (req.body.licensed) tutor.licensed = req.body.licensed;
            if (req.body.university_name) tutor.university_name = req.body.university_name;
            if (req.body.university_program) tutor.university_program = req.body.university_program;
            if (req.body.self_introduction) tutor.self_introduction = req.body.self_introduction;
    
            tutor.save()
                .then(tutor => {
                    res.status(200).json(success({data:tutor}, "Update successful"));
                })
                .catch(err => {
                    res.status(400).send('Updating failed');
                });
        }
    })
});

