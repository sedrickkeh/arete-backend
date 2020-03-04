var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TutorSchema = new Schema(
    {
        tutorImage: {type:String, required:false},
        name: {type:String, required:true},
        gender: {type:String, required:true},
        university: {type:String, required:true},
        secondary: {
            school: {type:String, required:true},
            curriculum: {type:String, required:true},
            score: {type:Number, required:true}
        },
        phone_number: {type:String, required:true},
        lessons: {
            subjects: [],
            location: {type:String, required:true},
            time: [],
            min_wage: {type:Number, required:true}
        },
        self_introduction: {type:String, required:true}
    }
);

module.exports = mongoose.model('Tutor', TutorSchema);