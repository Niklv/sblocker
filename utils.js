var config = require('./config');

module.exports = {
    leading_zero: function (num, size) {
        var str = num + "";
        while (str.length < size)
            str = "0" + str;
        return str;
    },
    generate_phone_regexp: function () {
        config.phone_regexp = new RegExp("^[0-9]{" + config.min_phone_len + "," + config.max_phone_len + "}$");
    },
    phone: function (phone) {
        if (!phone)
            return {
                err: "number is not provided",
                err_code: 1
            };
        phone = phone.match(config.phone_regexp);
        if (!phone || phone[0].length < config.min_phone_len || phone[0].length > config.max_phone_len)
            return {
                err: "phone format error",
                err_code: 2
            };
        return {str: phone[0]};
    },
    getConnectionUrl: function () {
        return 'mongodb://' + config.mongo.user + ':' + config.mongo.pwd + '@' + config.mongo.url + '/' + config.mongo.db
    }
};
