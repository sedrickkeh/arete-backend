var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RatingSchema = new Schema(
    {
        student: {type: Schema.Types.ObjectId, ref:'User'},
        tutor: {type: Schema.Types.ObjectId, ref:'User'},
        score: {type:Number, required:true},
        comments: {type:String}
    }
);

module.exports = mongoose.model('Rating', RatingSchema);