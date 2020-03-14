var Location = require('../models/location');
var {success} = require('../tools/responseSender')
var {page} = require('../tools/pageInfo')

exports.location_list = function(req, res, next) {
    Location.find()
        .exec(function(err, list_locations) {
            if (err) {return next(err);}
            res.json(success({data:list_locations}));
        });
};

exports.location_list_page = function(req, res, next) {
    var per_page = parseInt(req.query.limit) || 10;
    var page_num = parseInt(req.query.page) || 1;
    var to_skip = (page_num-1) * per_page;
    Location.find().skip(to_skip).limit(per_page)
        .exec(function(err, list_locations) {
            if (err) {return next(err);}
            list_locations_page = page(list_locations, page_num, per_page);
            res.json(success(list_locations_page));
        });
};

exports.location_create_get = function(req, res, next) {
    res.send('Create GET not needed at this point');
};

exports.location_create_post = function(req, res, next) {
    var location = new Location(req.body);
    location.save()
        .then(location => {
            res.status(200).json(success({data:req.body}));
        })
        .catch(err => {
            res.status(400).send('creating failed');
        });
};

exports.location_delete_get = function(req, res, next) {
    res.send('Delete GET not needed at this point');
};

exports.location_delete_post = function(req, res, next) {
    Location.findByIdAndRemove(req.params.id, function deleteLocation(err) {
        if (err) {return next(err);}
        res.status(200).json(success({data:""}, "Delete successful"));
    });
};

exports.location_update_get = function(req, res, next) {
    Location.findById(req.params.id)
        .exec(function(err, location) {
            if (err) { return next(err); }
            if (location == null) {
                var err = new Error('Location not found');
                err.status = 404;
                return next(err);
            } 
            res.json(success({data:location}));
        });
};

exports.location_update_post = function(req, res, next) {
    Location.findById(req.params.id, function(err, location) {
        if (!location) {
            res.status(404).send("Location not found.");
        } else {
            location.name = req.body.name;
            location.save()
                .then(location => {
                    res.status(200).json(success({data:location}, "Update successful"));
                })
                .catch(err => {
                    res.status(400).send('Updating failed');
                });
        }
    })
};