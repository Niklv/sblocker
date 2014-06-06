var async = require('async');
var log = require('../utils/log')(module);
var SystemVariable = require('../models').SystemVariable;
var config = require('../config');

function initializeIfNotExist() {
    async.parallel([
            function (cb) {
                SystemVariable.findOne({ name: config.system_variables.client_db_version.name },
                    function (err, data) {
                        if (err || data)
                            cb(err, data);
                        else
                            new SystemVariable(config.system_variables.client_db_version).save(function(err, newvar){
                                cb(err, newvar);
                            });
                    }
                );
            }
        ], function (err, vars) {
            log.info("System variables:");
            if (err) {
                log.error(err);
                throw err;
            } else
                for (var i = 0; i < vars.length; i++) {
                    log.info(vars[i].name + " = " + vars[i].value);
                }
        }
    );
}


module.exports.initializeIfNotExist = initializeIfNotExist;