//var gcm = require('node-gcm');
var request = require('request');
var config = require('../../config');
var log = require('../../utils/log')(module);

function pushUpdateMessage() {
    var opt = {
        "headers": {
            "Content-Type": "application/json",
            "Authorization": "key=AIzaSyCc2_UwqljM_a9BFmRyTa05Wyuh7H-4GIA"
        },
        json: {
            registration_ids: ["ABC", "DEF"],
            data: {}
        }
    };

    request.post("https://android.googleapis.com/gcm/send", opt, function (err, res, body) {
        console.log(err, res.statusCode, body);
    });


}

module.exports.pushUpdateMessage = pushUpdateMessage;


/*var sender = new gcm.Sender(config.gcm.server_api_key);
 var registrationIds = [];
 var message = new gcm.Message({
 collapseKey: 'Database updates available',
 delayWhileIdle: true,
 //timeToLive: 24 * 60 * 60, // one day
 timeToLive: 60, // one minute
 data: {
 db_version: 400
 },
 dryRun: true
 });
 registrationIds.push('23f42f23f23g2323');
 sender.sendNoRetry(message, registrationIds, function (err, result) {
 console.log(err, result);
 });*/
