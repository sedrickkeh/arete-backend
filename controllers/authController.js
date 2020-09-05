var jwt = require('jsonwebtoken');  
var User = require('../models/users');
var authConfig = require('../configs/auth');


function generateToken(user){
    return jwt.sign(user, authConfig.secret, {
        expiresIn: '365d'
    });
}

function setUserInfo(request){
    return {
        _id: request._id,
        email: request.email,
        role: request.role
    };
}

exports.generateToken = generateToken;
exports.setUserInfo = setUserInfo;

exports.login_status = function(req, res, next) {
    var userInfo = req.user;
    res.status(200).json({
        user: userInfo
    });
}

exports.login = function(req, res, next){
    var userInfo = setUserInfo(req.user);
    res.status(200).json({
        token: 'JWT ' + generateToken(userInfo),
        user: userInfo
    });
}

exports.roleAuth = function(roles) {
    return function(req, res, next){
        var user = req.user;
        User.findById(user._id, function(err, foundUser){
            if(err){
                res.status(422).json({error: 'No user found.'});
                return next(err);
            }

            if(roles.indexOf(foundUser.role) > -1){
                return next();
            }

            res.status(401).json({error: 'You are not authorized to view this content'});
            // return next('Unauthorized');
        });
    }
}