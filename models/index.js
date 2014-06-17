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


module.exports.GlobalNumber = require('./global_number');
module.exports.UserNumber = require('./user_number');
module.exports.SystemVariable = require('./system_variable');
module.exports.User = require('./user');