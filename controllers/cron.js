var nconf = require('nconf');
var async = require('async');
var cron = require('cron');
var CronJob = cron.CronJob;
var token = require('./token');
var serverdb = require('./serverdb');
var clientdb = require('./clientdb');
var push_notification = require('./push_notification');
var log = require('./log')(module);


function getTokenCronJob() {
    return new CronJob(nconf.get('cron:updateTokenTime'), function () {
        try {
            token.updateCertificates();
        } catch (err) {
            log.error("Unknown error while updating certificates");
            log.error(err);
        }
    }, null, true);
}

function getClientDbCronJob() {
    return new CronJob(nconf.get('cron:updateDBTime'), function () {
        try {
            async.waterfall([
                async.apply(serverdb.update),
                function (info, done) {
                    if (!info)
                        async.waterfall([
                            async.apply(clientdb.create),
                            async.apply(push_notification.pushClientDbUpdate)
                        ], done);
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


