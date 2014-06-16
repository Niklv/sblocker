var async = require('async');
var token = require('./token');
var clientdb = require('./clientdb');
var system_variable = require('./system_variable');
var log = require('../utils/log')(module);


function onStart() {
    log.info("On Start");
    token.updateCertificates();
    async.parallel([
        async.apply(token.updateCertificates),
        async.apply(async.series, [
            async.apply(system_variable.initializeIfNotExist),
            async.apply(clientdb.create)
        ])
    ], function (err) {
        if (err)
            log.error(err.stack);
        log.info("On Start done");
    });
}

module.exports = onStart;
