var async = require('async');
var log = require('../utils/log')(module);
var SystemVariable = require('../models').SystemVariable;
var nconf = require('nconf');

function initializeIfNotExist(callback) {
    async.parallel([
            function (cb) {
                SystemVariable.findOne({ name: nconf.get("sys_vars:client_db_version:name") },
                    function (err, data) {
                        if (err || data)
                            cb(err, data);
                        else
                            new SystemVariable(nconf.get("sys_vars:client_db_version")).save(function (err, newvar) {
                                cb(err, newvar);
                            });
                    }
                );
            }
        ], function (err, vars) {
            log.info("System variables:");
            if (err) {
                log.error(err);
            } else
                for (var i = 0; i < vars.length; i++) {
                    log.info(vars[i].name + " = " + vars[i].value);
                }
            callback && callback(err, vars);
        }
    );
}


module.exports.initializeIfNotExist = initializeIfNotExist;