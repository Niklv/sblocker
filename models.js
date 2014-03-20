var mongoose = require('mongoose');
var plugin = require('./mongoose-plugins');

var Schema = mongoose.Schema;


var blacklist = new Schema({
    ph: {
        type: String,
        unique: true,
        require: true,
        index: true
    },
    bl: {
        type: Number,
        require: true
    },
    r: {
        type: Number,
        require: true
    }
});

var blacklist_stats = new Schema({
    item: {
        type: Schema.Types.ObjectId,
        ref: 'blacklist',
        require: true
    },
    createdAt: {
        type: Date
    }
});


var reason = new Schema({
    desc: {
        type: String,
        unique: true,
        require: true,
        index: true
    },
    n: {
        type: Number,
        require: true,
        unique: true,
        index: true
    }
});

var user = new Schema({
    username: {
        type: String,
        index: true,
        unique: true,
        required: true
    },
    password: {
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


module.exports = {
    blacklist: blacklist,
    blacklist_stats: blacklist_stats,
    reason: reason,
    user: user
};
