var mongoose = require('mongoose');
var crypto = require('crypto');
var config = require('../utils/config');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var token = new Schema({
    user: {
        type: ObjectId,
        ref: 'user',
        index: true
    },
    token: {
        type: String
    },
    createdAt: {
        type: Date,
        dafault: Date.now,
        index: {require: true, expires: config.security.token_ttl }
    }
});

token.methods.generateToken = function (cb) {
    var self = this;
    crypto.randomBytes(config.security.tokenLength, function (ex, buf) {
        self.token = buf.toString('hex');
        cb(null, self);
    });
};

token.statics.sid = function (str) {
    return crypto.createHash('md5').update(str).digest('hex');
};


module.exports = {token: mongoose.model('token', token)};
