var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var user = new Schema({
    email: {
        type: String,
        require: true,
        index: { unique: true }
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    isBanned: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date
    }
});

module.exports = mongoose.model('user', user);


