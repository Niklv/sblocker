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
    return new CronJob('0 5 * * * *', function () { // EVERY DAY AT 5:00
        //return new CronJob('0 */60 * * * *', function () { // EVERY HOUR
        //return new CronJob('*/60 * * * * *', function () { // EVERY MINUTE FOR TESTING
        try {
            async.waterfall([
                async.apply(serverdb.update),
                function (info, done) {
                    if (info)
                        clientdb.create(done);
                    else {
                        log.info("ClientDB update is not necessary");
                        done();
                    }

                }
            ], function (err) {
                if (err) {
                    log.error("Unknown error while updating client db");
                    log.error(err.stack);
                }
            });
        } catch (err) {
            log.error("Unknown error while updating client db");
            log.error(err.stack);
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


