var mongoose = require('mongoose');
var crypto = require('crypto');
var plugin = require('../utils/mongoose-plugins');
var Schema = mongoose.Schema;
var Model = mongoose.model.bind(mongoose);

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
    code: String,
    confirmed: {
        type: Boolean,
        default: false
    },
    is_banned: {
        type: Boolean,
        default: false
    },
    ban_until: {
        type: Date,
        default: Date.now
    }
}).plugin(plugin.timestampsPlugin);

user.methods.encryptPassword = function (password) {
    return crypto.pbkdf2Sync(password, this.salt, 10000, 512);
};

user.methods.checkPassword = function (password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

user.virtual('userId').get(function () {
    return this.id;
});

user.virtual('password').set(function (password) {
    this._plainPassword = password;
    this.salt = crypto.randomBytes(128).toString('base64');
    this.hashedPassword = this.encryptPassword(password);
});

user.virtual('password').get(function () {
    return this._plainPassword;
});


var User = Model('user', user);

module.exports = {user: User};