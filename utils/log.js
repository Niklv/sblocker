var winston = require('winston');
var ENV = process.env.NODE_ENV;

function getLogger(module) {
    var path = module.filename.replace(/\\/g, '/').split('/').slice(-2).join('/');

    return new winston.Logger({
        transports: [
            new winston.transports.Console({
                colorize: true,
                timestamp: function () {
                    return new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
                },
                level: ENV == 'production' ? 'info' : 'debug',
                label: path
            })
        ]
    });
}

module.exports = getLogger;

