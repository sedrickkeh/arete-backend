var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TutorSchema = new Schema(
    {
        // tutorImage: {type:String, required:false},
        title: {type:String, required:true},
        name: {type:String, required:true},
        email: {type:String, required:true},
        tutor_id: {type:Number, default:-1},
        pref_name: {type:String},
        gender: {type:String, required:true},
        age: {type: Number, required: true},
        contact_number: {type:String, required:true},
        examination: [String],
        overall_score: {type: String},
        detailed_scores: {type: String},
        subjects: [String],
        experience: {type:String, required:true},
        licensed: {type:Boolean, required:true},
        university_name: {type:String},
        university_program: {type:String},
        time: [String],
        hourly_rate: {type:Number},
        preference: {type:String, required:true},
        location: [{type: Schema.Types.ObjectId, ref:'Location'}],
        self_introduction: {type:String, required:true}
    }
);

module.exports = mongoose.model('Tutor', TutorSchema);