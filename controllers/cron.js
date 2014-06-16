var async = require('async');
var cron = require('cron');
var CronJob = cron.CronJob;
var token = require('./token');
var serverdb = require('./serverdb');
var clientdb = require('./clientdb');
var log = require('../utils/log')(module);


function getTokenCronJob() {
    return new CronJob('0 */30 * * * *', function () {
        try {
            token.updateCertificates();
        } catch (err) {
            log.error("Unknown error while updating certificates");
            log.error(err);
        }
    }, null, true);
}

function getClientDbCronJob() {
    return new CronJob('0 */60 * * * *', function () {
        try {
            async.series([
                async.apply(serverdb.update),
                async.apply(clientdb.create)
            ], function (err) {
                if (err) {
                    log.error("Unknown error while updating client db");
                    log.error(err);
                }
            });
        } catch (err) {
            log.error("Unknown error while updating client db");
            log.error(err);
        }
    }, null, true);
}

function setup() {
    log.info("Setup Cron jobs");
    var jobs = {};
    jobs.token = getTokenCronJob();
    jobs.clientDb = getClientDbCronJob();
    return jobs;
}


module.exports.setup = setup;


