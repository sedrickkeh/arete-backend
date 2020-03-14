var Tutor = require('../models/tutor');
var multer = require('multer');
var {success} = require('../tools/responseSender')
var {page} = require('../tools/pageInfo')

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
    Tutor.find()
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
    if (req.query.subject) filter["lessons.subjects"] = { "$regex": req.query.subject, "$options": "i" };
    if (req.query.name) filter["name"] = { "$regex": req.query.name, "$options": "i" };

    Tutor.find(filter)
        .skip(to_skip).limit(per_page)
        .exec(function(err, list_tutors) {
            if (err) {return next(err);}
            list_tutors_page = page(list_tutors, page_num, per_page);
            res.json(success(list_tutors_page));
        });
});

exports.tutor_detail = ((req, res, next) => {
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

exports.tutor_find_one = ((req, res, next) => {
    Tutor.findOne()
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

exports.tutor_create_get = ((req, res, next) => {
    res.send('Create GET not needed at this point');
});

exports.tutor_create_post = ((req, res, next) =>{
    var tutor = new Tutor(req.body);
    tutor.save()
        .then(tutor => {
            res.status(200).json(success({data:req.body}));
        })
        .catch(err => {
            res.status(400).send('creating failed');
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

exports.tutor_update_post = (upload.single('imageFile'), (req, res, next) => {
    Tutor.findById(req.params.id, function(err, tutor) {
        if (!tutor) {
            res.status(404).send("Tutor not found.");
        } else {
            // tutor.tutorImage = req.file.path
            tutor.name = req.body.name;
            tutor.gender = req.body.gender;
            tutor.university = req.body.university;
            tutor.secondary.school = req.body.secondary.school;
            tutor.secondary.curriculum = req.body.secondary.curriculum;
            tutor.secondary.score = req.body.secondary.score;
            tutor.phone_number = req.body.phone_number;
            tutor.lessons.subjects = req.body.lessons.subjects;
            tutor.lessons.location = req.body.lessons.location;
            tutor.lessons.time = req.body.lessons.time;
            tutor.lessons.min_wage = req.body.lessons.min_wage;
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

