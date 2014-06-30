var mongoose = require('mongoose');
var nconf = require('nconf');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;


var admin = new Schema({
    username: {
        type: String,
        require: true,
        index: { unique: true }
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

admin.pre('save', function (next) {
    var admin = this;
    if (!admin.isModified('password')) return next();
    bcrypt.genSalt(nconf.get('SALT_WORK_FACTOR'), function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(admin.password, salt, null, function (err, hash) {
            if (err) return next(err);
            admin.password = hash;
            next();
        });
    });
});

admin.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('admin', admin);



