var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TutorSchema = new Schema(
    {
        // tutorImage: {type:String, required:false},
        name: {type:String, required:true},
        gender: {type:String, required:true},
        university: {type:String, required:true},
        secondary_school: {type:String, required:true},
        curriculum: {type:String},
        score: {type:Number},
        phone_number: {type:String, required:true},
        subjects: [String],
        time: [String],
        hourly_rate: {type:Number},
        location: {type: Schema.Types.ObjectId, ref:'Location', required:true},
        self_introduction: {type:String, required:true}
    }
);

module.exports = mongoose.model('Tutor', TutorSchema);