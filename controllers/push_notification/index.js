var _ = require('underscore');
var nconf = require('nconf');
var async = require('async');
var android = require('./android');
var log = require('../../utils/log')(module);
var models = require('../../models');
var User = models.User;
var ObjectId = require('mongoose').Types.ObjectId;


function pushClientDbUpdate(version, callback) {
    var chunk = [],
        chunk_size = 1000,
        globalERR = null,
        message = {
            collapse_key: "database_update_message",
            delay_while_idle: true,
            time_to_live: nconf.get('gcm:pushTTL'),
            data: {
                message: "Database update available!",
                version: version
            }
        },
        nBatch = 1,
        stream = User.find({
                androidRegistrationId: {$exists: true},
                isBanned: false, isEmailVerified: true},
            {androidRegistrationId: 1})
            .lean()
            .batchSize(chunk_size)
            .stream();
    log.info('Stream start');
    stream.on('data', function (doc) {
        chunk.push(doc);
        if (chunk.length >= chunk_size) {
            stream.pause();
            log.info("Start process batch" + nBatch++);
            async.waterfall([
                async.apply(android.push, message, chunk.map(function (item) {
                    return item.androidRegistrationId;
                })),
                function (data, done) {
                    var clear = [];
                    log.info("Success : " + data.success);
                    if (data.failure)
                        log.error("Failure : " + data.failure);
                    data.results.forEach(function (item, index) {
                        if (_.has(item, "error") && item.error) clear.push(chunk[index]._id);
                    });
                    User.update({_id: {$in: clear}}, {$unset: {androidRegistrationId: ""}}, {multi: true}, done);
                }
            ], function (err) {
                log.info("End process batch");
                chunk = [];
                if (err) {
                    log.error(err.stack);
                    stream.destroy(new Error("Process stream error"));
                } else
                    stream.resume();
            });
        }
    }).on('error', function (err) {
        log.error('Stream error', err.stack);
        globalERR = err;
    }).on('close', function () {
        log.info('Stream close');
        callback && callback(globalERR);
    });
}

module.exports.pushClientDbUpdate = pushClientDbUpdate;
module.exports.android = android;
