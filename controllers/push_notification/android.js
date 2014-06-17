var gcm = require('node-gcm');
var config = require('../../config');
var log = require('../../utils/log')(module);

function pushUpdateMessage() {
    var sender = new gcm.Sender(config.gcm.server_api_key);
    var registrationIds = [];
    var message = new gcm.Message({
        collapseKey: 'Database updates available',
        delayWhileIdle: true,
        timeToLive: 24 * 60 * 60,
        data: {
            db_version: 400
        },
        dryRun: true
    });
    registrationIds.push('23f42f23f23g2323');
    sender.send(message, registrationIds, 4, function (err, result) {
        if(err)
            log.error(err);
        log.info(result);
    });

}

module.exports.pushUpdateMessage = pushUpdateMessage;
