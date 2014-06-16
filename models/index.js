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
    //require('../controllers/serverdb').update();
});


module.exports.GlobalNumber = require('./global_number');
module.exports.UserNumber = require('./user_number');
module.exports.Whitelist = require('./whitelist');
module.exports.Blacklist = require('./blacklist');
module.exports.SystemVariable = require('./system_variable');
module.exports.UserList = require('./user_list');
module.exports.User = require('./user');