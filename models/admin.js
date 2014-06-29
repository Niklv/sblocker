var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;


var admin = new Schema({
    email: {
        type: String,
        require: true,
        index: { unique: true }
    },
    password: {
        type: String
    },
    salt: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

admin.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};


admin.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('admin', admin);



