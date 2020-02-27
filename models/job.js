var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var JobSchema = new Schema(
    {
        title: {type:String, required:true},
        location: {type:String, required:true},
        type: {type:String, required:true},
        created_date: {type:Date, default:Date.now()},
        updated_date: {type:Date, default:Date.now()},
        description: {type:String, required:true},
        is_active: {type:Boolean, default:true}
    }
);

module.exports = mongoose.model('Job', JobSchema);