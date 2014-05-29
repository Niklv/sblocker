var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var useraction = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        require: true,
        index: true
    },
    type:{
        type: String,
        require: true,
        index: true
    },
    data: {
        type: Schema.Types.Mixed
    },
    createdAt: {
        type: Date
    }
});

module.exports = mongoose.model('useraction', useraction);
