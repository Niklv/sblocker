var _ = require("underscore");
var nconf = require('nconf');
var retry = require('retry');
var request = require('request');
var log = require('../log')(module);

function push(message, registrationIds, callback) {
    var opts = {
        uri: 'https://android.googleapis.com/gcm/send',
        headers: {
            Authorization: 'key=' + nconf.get("gcm:server_api_key")
        }
    };
    log.info("Send message");
    log.info(message);
    if (!_.isObject(message))
        return callback(new Error("No message provided"));
    if (!_.isArray(message.registration_ids))
        if (!_.isArray(registrationIds) || !registrationIds.length)
            return callback(new Error("No registrationIds provided"));
    opts.json = _.clone(message);
    if (!opts.json.registration_ids)
        opts.json.registration_ids = registrationIds;
    if (opts.json.registration_ids.length > 1000)
        return callback(new Error("Too many registrationIds provided"));
    if (!opts.json.dry_run)
        opts.json.dry_run = nconf.get("gcm:dry_run");
    var operation = retry.operation({retries: nconf.get("gcm:retries"), factor: 3});
    operation.attempt(function (currentAttempt) {
        log.info("Send message attempt " + currentAttempt);
        request.post(opts, function (err, response, body) {
            if (!err)
                if (typeof body != "object")
                    err = new Error("No JSON response");
                else if (response.statusCode != 200)
                    err = new Error("Response code not 200");
                else if (!_.has(body, "multicast_id")
                    || !_.has(body, "success")
                    || !_.has(body, "failure")
                    || !_.has(body, "canonical_ids")
                    || !_.has(body, "results"))
                    err = new Error("Not enough fileds");
            if (err) {
                log.error("Body:", body);
                log.error(err.stack);
            }
            if (operation.retry(err))
                return;
            callback && callback(err ? operation.mainError() : null, body);
        });
    });
}


function pushMessage() {
    var msg = {
        registration_ids: ["ABC1", "ABC2"], // this is the device token (phone)
        collapse_key: "database_update_message",
        delay_while_idle: true,
        time_to_live: 24 * 60 * 60, // one day
        dry_run: true, //must see enviroment
        data: {
            message: "Database update available!",
            version: 400
        }
    };

    request.post(_.extend(default_opts, {json: msg}), function (err, response, body) {
        log.info(body);
    });
}

module.exports.pushMessage = pushMessage;
module.exports.push = push;



