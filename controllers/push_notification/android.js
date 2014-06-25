var _ = require("underscore");
var request = require('request');
var nconf = require('nconf');
var log = require('../../utils/log')(module);

var default_opts = {
    uri: 'https://android.googleapis.com/gcm/send',
    headers: {
        Authorization: 'key=' + nconf.get("gcm:server_api_key")
    }
};


function push(message, registrationIds, callback) {
    if (!_.isObject(message))
        return callback(new Error("No message provided"));
    if (!_.has(message, "time_to_live"))
        return callback(new Error("time_to_live not set in message"));
    if (!_.isArray(registrationIds) || !registrationIds.length)
        return callback(new Error("No registrationIds provided"));
    if (registrationIds.length > 1000)
        return callback(new Error("Too many registrationIds provided"));
    var opts = _.extend(default_opts, {registration_ids: registrationIds, json: message});
    opts.dry_run = nconf.get("gcm:dry_run");
    request.post(opts, function (err, response, body) {
        callback || callback(err, response, body);
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



