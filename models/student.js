var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StudentSchema = new Schema(
    {
        name: {type:String, required:true},
        gender: {type:String, required:true},
        email: {type:String, required:true},
        secondary: {
            school: {type:String, required:true},
            curriculum: {type:String, required:true},
            year: {type:Number, required:true}
        },
        contact_number: {type:String, required:true},
        subjects: [String],
        i_prefer: {type:String, required:true},
        location: {type:String, required:true},
        hourly_rate: {type:Number},
        description_of_needs: {type:String}
    }
);

module.exports = mongoose.model('Student', StudentSchema);