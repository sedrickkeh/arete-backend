var Tutor = require('../models/users');
var Location = require('../models/location');
var idschema = require('../tools/idSchema');
var multer = require('multer');
var {success} = require('../tools/responseSender')
var {page} = require('../tools/pageInfo')
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
    tutor.email = req.body.email;
    tutor.password = req.body.password;
    tutor.role = "tutor"

    // General Info
    tutor.title = req.body.title;
    tutor.name = req.body.name;
    tutor.pref_name = req.body.pref_name;
    tutor.gender = req.body.gender;
    tutor.age = req.body.age;
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


    idschema.find({name:"Tutor"})
        .exec(function(err, tutorcntr) {
            tutorcntr[0].count += 1;
            tutorcntr[0].save()
            tutor.user_id = tutorcntr[0].count;
            tutor.save()
            .then(tutor => {
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
        } else {
            // Login Info
            tutor.email = req.body.email;
            tutor.password = req.body.password;
            tutor.role = "tutor"

            // General Info
            tutor.title = req.body.title;
            tutor.name = req.body.name;
            tutor.pref_name = req.body.pref_name;
            tutor.gender = req.body.gender;
            tutor.age = req.body.age;
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

