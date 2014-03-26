var mongoose = require('mongoose');
var _ = require('underscore');
var user = require('./user');
var blacklist = require('./blacklist');
var log = require('../utils/log')(module);
var config = require('../utils/config');

//mongoose.set('debug', true);
mongoose.connect('mongodb://' + config.mongo.url + '/' + config.mongo.db, {
    db: { native_parser: true},
    user: config.mongo.user,
    pass: config.mongo.pwd

});

mongoose.connection.on('error', function (err) {
    log.error('MongoDB connection error:', err.message);
});

mongoose.connection.once('open', function () {
    log.info("Connected to MongoDB");
});


exports.db = mongoose.connection;
exports.models = _.extend({}, user, blacklist);

