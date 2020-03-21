var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StudentSchema = new Schema(
    {
        contact: {
            title: {type:String, required:true},
            name: {type:String, required:true},
            contact_number:{type:String, required:true},
            email: {type:String, required:true},
            relationship: {type:String, required:true}
        },
        name: {type:String, required:true},
        student_id: {type:Number, default:-1},
        gender: {type:String, required:true},
        email: {type:String, required:true},
        school: {type:String, required:true},
        year: {type:Number, required:true},
        examination: [String],
        contact_number: {type:String, required:true},
        subjects: [String],
        preference: {type:String, required:true},
        location: [{type: Schema.Types.ObjectId, ref:'Location'}],
        hourly_rate: {type:Number},
        description: {type:String}
    }
);

module.exports = mongoose.model('Student', StudentSchema);