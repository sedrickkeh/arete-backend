var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RatingSchema = new Schema(
    {
        student: {type: Schema.Types.ObjectId, ref:'Profile'},
        tutor: {type: Schema.Types.ObjectId, ref:'Profile'},
        score: {type:Number, 
                enum: [1,2,3,4,5], 
                required:true},
        comments: {type:String}
    }, {
        timestamps: true
    }
);

module.exports = mongoose.model('Rating', RatingSchema);