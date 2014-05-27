var cron = require('cron');
var CronJob = cron.CronJob;
var token = require('./token');
var clientdb = require('./clientdb');
var log = require('../utils/log')(module);


function getTokenCronJob() {
    return new CronJob('* */15 * * * *', function () {
        try {
            token.updateCertificates();
        } catch (err) {
            log.error("Unknown error while updating certificates");
            log.error(err);
        }
    }, null, true);
}

function getClientDbCronJob() {
    return new CronJob('* */60 * * * *', function () {
        try {
            clientdb.create();
        } catch (err) {
            log.error("Unknown error while updating client db");
            log.error(err);
        }
    }, null, true);
}

function setup() {
    log.info("Setup Cron tasks");
    var jobs = {};
    jobs.token = getTokenCronJob();
    jobs.clientDb = getClientDbCronJob();
    log.info("Run once each job");
    token.updateCertificates();
    clientdb.create();
    return jobs;
}


module.exports.setup = setup;


