var mongoose = require('mongoose');
var crypto = require('crypto');
var config = require('../utils/config');
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
    tokens: Array,
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

user.methods.generateToken = function(){
    /*if(this.tokens)
        this.tokens = [];
    if(this.tokens.length>config.security.maxAllowedTokens)
        this.tokens.shift();
    */

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

user.static('login', function (){
    console.log("LOGIN FUNCTION");
});


var User = Model('user', user);


module.exports = {user: User};