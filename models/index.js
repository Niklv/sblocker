var mongoose = require('mongoose');
var _ = require('underscore');
var log = require('../utils/log')(module);
var config = require('../config');

mongoose.connect('mongodb://' + config.mongo.url + '/' + config.mongo.db, {
    db: { native_parser: true},
    user: config.mongo.user,
    pass: config.mongo.pwd
});

mongoose.connection.on('error', function (err) {
    log.error('MongoDB connection error:', err.message);
    throw err;
});

mongoose.connection.once('open', function () {
    log.info("Connected to MongoDB");
});


module.exports = _.extend({}, {
    Whitelist: require('./whitelist'),
    Blacklist: require('./blacklist'),
    User: require('./user')
});


