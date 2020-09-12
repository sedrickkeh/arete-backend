var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var UserSchema = new Schema(
    {
        // Login Info
        email: {type:String, required:true},
        password1: {type:String, required:true},
        password2: {type:String,required:true},
        role: {type: String,
            enum: ['student', 'tutor', 'admin'],
            default: 'student'
        },

        // User Info
        name: {type: String, required:true},
        user_id: {type:Number, default:-1}
        
    }, {
        timestamps: true
    }
);


UserSchema.pre('save', function(next){
    var user = this;
    var SALT_FACTOR = 5;

    if(!user.isModified('password1')) {return next();} 

    bcrypt.genSalt(SALT_FACTOR, function(err, salt){
        if(err) {return next(err);}

        bcrypt.hash(user.password1, salt, null, function(err, hash){
            if(err) {return next(err);}
            user.password1 = hash;
            next();
        });

        bcrypt.hash(user.password2, salt, null, function(err, hash){
            if(err) {return next(err);}
            user.password2 = hash;
            next();
        });
    });
})


UserSchema.methods.comparePassword = function(passwordAttempt, cb){
    bcrypt.compare(passwordAttempt, this.password1, function(err, isMatch) {
        if(err){
            return cb(err);
        } else {
            cb(null, isMatch);
        }
    });
}


module.exports = mongoose.model('User', UserSchema);