var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var idSchema = new Schema(
    {
        name: {type:String, required:true},
        count: {type:Number, required:true}
    }
);

module.exports = mongoose.model('id', idSchema);