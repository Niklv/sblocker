var _ = require("underscore");
var winston = require('winston');
var nconf = require('nconf');
var emitter = require('./logs.io').emitter;

function getLogger(module) {
    var path = module.filename.replace(/\\/g, '/').split('/').slice(-2).join('/');
    var logger = new winston.Logger({
        transports: [
            new winston.transports.Console({
                colorize: true,
                prettyPrint: true,
                timestamp: function () {
                    return new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
                },
                level: nconf.get('log_level'),
                label: path
            })
        ]
    });
    var originalErrorLogger = logger.error;
    logger.error = function errorRewriter(message, metadata) {
        if (!(message instanceof Error))
            return originalErrorLogger.apply(logger, arguments);
        var error = message;
        metadata = _.clone(metadata || {});
        error.code = _.isUndefined(error.code) ? null : error.code;
        message = error.stack;
        var args = [message, metadata].concat(_.rest(arguments, 2));
        originalErrorLogger.apply(logger, args);
    };
    logger.on('logging', function (transport, level, msg, meta) {
        if (_.isEmpty(meta) && !msg.length)
            return;
        var str = transport.timestamp() + "\t" + level;
        if (msg.length)
            str += ":\t" + msg;
        if (!_.isEmpty(meta))
            str += "\t" + JSON.stringify(meta, null, "\t");
        emitter.emit('logging', str);
    });
    return logger;

}

module.exports = getLogger;


