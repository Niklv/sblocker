var mongoose = require('mongoose');
var _ = require('underscore');
var user = require('./user');
var blacklist = require('./blacklist');
var log = require('../utils/log')(module);
var config = require('../utils/config');

mongoose.connect('mongodb://' + config.mongo.user + ':' + config.mongo.pwd + '@' + config.mongo.url + '/' + config.mongo.db);

mongoose.connection.on('error', function (err) {
    log.error('MongoDB connection error:', err.message);
});

mongoose.connection.once('open', function () {
    log.info("Connected to MongoDB");
});


exports.db = mongoose.connection;
exports.models = _.extend({}, user, blacklist);

