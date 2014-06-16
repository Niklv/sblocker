var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user_number = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        require: true,
        index: true
    },
    number: {
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
    updatedAt: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}).index({user: 1, number: 1}, {unique: true});

module.exports = mongoose.model('user_number', user_number);

