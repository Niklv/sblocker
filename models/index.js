var mongoose = require('mongoose');
var log = require('../utils/log')(module);
var nconf = require('nconf');

mongoose.connect(nconf.get("mongo:url"), {
    db: { native_parser: true},
    user: nconf.get("mongo:user"),
    pass: nconf.get("mongo:pass")
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
module.exports.Admin = require('./admin');