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

        // General Info
        title: {type:String},
        name: {type:String},
        pref_name: {type:String},
        user_id: {type:Number, default:-1},
        gender: {type:String},
        age: {type:Number},
        contact_number: {type:String},


        // Learning-related
        location: [{type: Schema.Types.ObjectId, ref:'Location'}],
        hourly_rate: {type:Number},
        preference: {type:String},
        subjects: [String],
        time: [String],

        // Tutor Only
        examination_tutor: [String],
        overall_score: {type: String},
        detailed_scores: {type: String},
        experience: {type:String},
        licensed: {type:Boolean},
        university_name: {type:String},
        university_program: {type:String},
        self_introduction: {type:String},
        num_ratings: {type:Number},
        ave_rating: {type:Number},

        // Student Only
        contact: {
            title: {type:String},
            name: {type:String},
            contact_number:{type:String},
            email: {type:String},
            relationship: {type:String}
        },
        school: {type:String},
        year: {type:String},
        examination_student: [String],
        description: {type:String}
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