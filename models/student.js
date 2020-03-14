var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StudentSchema = new Schema(
    {
        name: {type:String, required:true},
        gender: {type:String, required:true},
        email: {type:String, required:true},
        school: {type:String, required:true},
        year: {type:Number, required:true},
        contact_number: {type:String, required:true},
        subjects: [String],
        preference: {type:String, required:true},
        location: {type: Schema.Types.ObjectId, ref:'Location', required:true},
        hourly_rate: {type:Number},
        description: {type:String}
    }
);

module.exports = mongoose.model('Student', StudentSchema);