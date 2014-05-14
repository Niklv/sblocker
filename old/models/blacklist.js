var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var blacklist = new Schema({
    ph: {
        type: String,
        require: true,
        index: { unique: true }
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

var blacklist_stat = new Schema({
    item: {
        type: Schema.Types.ObjectId,
        ref: 'blacklist',
        require: true
    },
    createdAt: {
        type: Date
    }
});


var type = new Schema({
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

module.exports = {
    blacklist: mongoose.model('blacklist', blacklist),
    blacklist_stat: mongoose.model('blacklist_stat', blacklist_stat),
    type: mongoose.model('reason', reason),
    reason: mongoose.model('type', type)
};