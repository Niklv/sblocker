var crypto = require('crypto');
var config = require('./config');
var error = require('./errors');

module.exports = {
    generate_phone_regexp: function () {
        config.phone_regexp = new RegExp("^[0-9]{" + config.min_phone_len + "," + config.max_phone_len + "}$");
    },
    phone: function (phone) {
        if (!phone)
            return error(1);
        phone = phone.match(config.phone_regexp);
        if (!phone || phone[0].length < config.min_phone_len || phone[0].length > config.max_phone_len)
            return error(2);
        return {str: phone[0]};
    },
    getConnectionUrl: function () {
        return 'mongodb://' + config.mongo.user + ':' + config.mongo.pwd + '@' + config.mongo.url + '/' + config.mongo.db
    },
    generateKey: function (cb) {
        crypto.randomBytes(48, function (ex, buf) {
            cb(buf.toString('hex'));
        });
    }
};
