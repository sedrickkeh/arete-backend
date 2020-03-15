var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TutorSchema = new Schema(
    {
        // tutorImage: {type:String, required:false},
        name: {type:String, required:true},
        gender: {type:String, required:true},
        contact_number: {type:String, required:true},
        examination: [String],
        subjects: [String],
        time: [String],
        hourly_rate: {type:Number},
        location: {type: Schema.Types.ObjectId, ref:'Location', required:true},
        self_introduction: {type:String, required:true}
    }
);

module.exports = mongoose.model('Tutor', TutorSchema);