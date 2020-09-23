var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RequestSchema = new Schema(
    {
        student: {type: Schema.Types.ObjectId, ref:'Profile'},
        tutor: {type: Schema.Types.ObjectId, ref:'Profile'},
        status: {type: String, 
                enum: ["pending", "accepted", "completed"], 
                required:true},
        subject: {type:String}
    }, {
        timestamps: true
    }
);

module.exports = mongoose.model('Request', RequestSchema);