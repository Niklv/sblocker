var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Model = mongoose.model.bind(mongoose);


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


var Blacklist = Model('blacklist', blacklist);
var Blacklist_stat = Model('blacklist_stat', blacklist_stat);
var Reason = Model('reason', reason);

module.exports = {
    blacklist:Blacklist,
    blacklist_stat: Blacklist_stat,
    reason: Reason
};