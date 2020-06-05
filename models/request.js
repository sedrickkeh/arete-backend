var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RequestSchema = new Schema(
    {
        title: {type:String, required:true},
        student: {type: Schema.Types.ObjectId, ref:'User'},
        location: [{type: Schema.Types.ObjectId, ref:'Location'}],
        subject: {type:String, required:true},
        description: {type:String, required:true},

        tutors_applied: [{type: Schema.Types.ObjectId, ref:'User'}],
        is_active: {type:Boolean, default:true}
    }
);

module.exports = mongoose.model('Request', RequestSchema);