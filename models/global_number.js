var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var global_number = new Schema({
    number: {
        type: String,
        require: true,
        index: { unique: true }
    },
    goodness: {
        type: Number,
        require: true,
        default: 0,
        index: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('global_number', global_number);

