var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var mail = new Schema({
    user: {
        type: ObjectId,
        ref: 'user',
        index: true
    },
    template: {
        type: ObjectId,
        ref: 'mail_template'
    },
    content: {
        type: String,
        require: true
    },
    type: {
        type: String,
        enum: ['send error'],
        require: true
    },
    description: String,
    createAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = {mail: mongoose.model('mail', mail)};