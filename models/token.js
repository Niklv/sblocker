var mongoose = require('mongoose');
var crypto = require('crypto');
var config = require('../utils/config');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var Model = mongoose.model.bind(mongoose);


var token = new Schema({
    user: {
        type: ObjectId,
        ref: 'user',
        index: true
    },
    token:{
        type: String
    },
    createdAt: {
        type: Date,
        dafault: Date.now,
        expired: config.security.tokenLife
    }
});

var Token = Model('token', token);


module.exports = {token: Token};
