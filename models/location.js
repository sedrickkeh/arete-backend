var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LocationSchema = new Schema(
    {
        name: {type:String, required:true}
    }
);

module.exports = mongoose.model('Location', LocationSchema);