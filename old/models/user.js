var mongoose = require('mongoose');
var crypto = require('crypto');
var async = require('async');
var DatabaseError = require('../utils/errors').DatabaseError;
var Token = require('./token').token;
var Mail = require('./mail').mail;
var Schema = mongoose.Schema;

var user = new Schema({
    username: {
        trim: true,
        type: String,
        required: true,
        index: { unique: true }
    },
    email: {
        trim: true,
        type: String,
        required: true,
        index: { unique: true }
    },
    hashedPassword: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 1,
        required: true
    },
    ph: Array,
    imei: Array,
    confirmed: {
        type: Boolean,
        default: true
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    is_banned: {
        type: Boolean,
        default: false
    },
    ban_until: {
        type: Date,
        default: Date.now
    }
});

user.methods.encryptPassword = function (password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

user.methods.checkPassword = function (password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

user.methods.sendAuthMail = function (cb) {
    cb(null, this);
};

user.methods.generateToken = function (cb) {
    user = this;
    async.waterfall([
        function (cb) {
            Token.findOne({user: user._id}, function (err, token) {
                cb(err, token);
            });
        },
        function (token, cb) {
            if (token) {
                token.remove(function (err) {
                    cb(err);
                });
            } else {
                cb(null);
            }
        },
        function (cb) {
            var t = new Token({user: user._id, createdAt: new Date()});
            t.generateToken(cb);
        },
        function (token, cb) {
            token.save(cb);
        }
    ], function (err, token) {
        if (err) {
            cb(new DatabaseError(err.message));
        } else {
            cb(null, user, token);
        }
    });
};


user.virtual('userId').get(function () {
    return this.id;
});

user.virtual('password').set(function (password) {
    this._plainPassword = password;
    this.salt = crypto.randomBytes(32).toString('base64');
    this.hashedPassword = this.encryptPassword(password);
});

user.virtual('password').get(function () {
    return this._plainPassword;
});

module.exports = {user: mongoose.model('user', user)};