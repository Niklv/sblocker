var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var blacklist = new Schema({
    ph: {
        type: String,
        index: true
    },
    time: Date
}, { autoIndex: false });

var user = new Schema({
    ph: {
        type: String,
        index: true
    },
    imei: {
        type: String,
        index: true
    },
    code: String,
    since: {
        type: Date,
        default: Date.now
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    key: {
        type: String,
        dafault: null
    },
    ban: {
        type: Boolean,
        default: false
    },
    ban_until: {
        type: Date,
        default: Date.now
    }
}, { autoIndex: false });




module.exports = {
    blacklist: blacklist,
    user: user
};
