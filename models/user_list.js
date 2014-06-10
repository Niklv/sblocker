var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user_list = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        require: true,
        index: true
    },
    phone: {
        type: String,
        require: true,
        index: true
    },
    category: {
        type: String,
        require: true,
        enum: ['black', 'white'],
        index: true
    },
    createdAt: {
        type: Date
    }
});

module.exports = mongoose.model('user_list', user_list);
