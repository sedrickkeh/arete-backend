var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StudentSchema = new Schema(
    {
        name: {type:String, required:true},
        gender: {type:String, required:true},
        secondary: {
            school: {type:String, required:true},
            curriculum: {type:String, required:true},
            year: {type:Number, required:true}
        },
        phone_number: {type:String, required:true},
        lessons: {
            subjects: [],
            location: {type:String, required:true},
        }
    }
);

module.exports = mongoose.model('Student', StudentSchema);