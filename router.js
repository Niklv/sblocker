var utils = require('./utils');
var config = require('./config');
var error = require('./errors');
var async = require('async');

var router = {
    bind: function (app) { //bind all routes to app
        app.get("/code", function (req, res) {
            async.auto({
                parse: function (cb) {
                    var phone = utils.phone(req.query.ph);
                    if (phone.err)
                        cb(phone);
                    else
                        cb(null, phone);
                },
                user: ['parse', function (cb, r) {
                    var phone = r.parse.str;
                    app.models.user.find({ $or: [
                        {ph: phone},
                        {imei: phone}
                    ]}, function (err, users) {
                        if (err)
                            cb(error(3, err));
                        else if (users.length > 1) {//TODO: logic for multiple
                            var str = "";
                            for (var i = 0; i < users.length; i++)
                                str += users[i]._id + ";";
                            cb(error(4, str));
                        } else if (users.length == 1) {
                            cb(null, users[0]);
                        } else
                            cb(null, new app.models.user({
                                ph: phone,
                                imei: phone
                            }));
                    });
                }],
                code: ['user', function (cb, r) {
                    r.user.code = ("" + Math.random()).substring(2, 2 + config.code_size);
                    cb(null, r.user.code);
                }],
                save: ['code', function (cb, r) {
                    r.user.save(cb);
                }]
            }, function (err, r) {
                if (err) {
                    console.log(err);
                    res.json(err);
                } else {
                    console.log(r.user._id, r.user.ph, r.code);
                    res.json({code: r.code});
                }
            });
        });

        app.post("/code", function (req, res) {
            async.auto({
                parse: function (cb) {
                    var phone = utils.phone(req.query.ph);
                    if (phone.err)
                        cb(phone);
                    else {
                        var code = utils.code(req.query.code);
                        if (code.err)
                            cb(code);
                        else
                            cb(null, {ph: phone.str, code: code.str});
                    }
                },
                user: ['parse', function (cb, r) {
                    app.models.user.find({ $and: [
                        {ph: r.parse.ph},
                        {imei: r.parse.ph},
                        {code: r.parse.code}
                    ]}, function (err, users) {
                        if (err)
                            cb(error(3, err));
                        else if (users.length > 1) {//TODO: logic for multiple
                            var str = "";
                            for (var i = 0; i < users.length; i++)
                                str += users[i]._id + ";";
                            cb(error(4, str));
                        } else if (users.length == 1) {
                            cb(null, users[0]);
                        } else
                            cb(error(7));
                    });
                }],
                save: ['user', function (cb, r) {
                    r.user.confirmed = true;
                    utils.generateKey(function(key){
                        r.user.key = key;
                        r.user.save(function(err){
                            if(err)
                                cb(error(3, err));
                            else
                                cb(null);
                        });
                    });
                }]
            }, function (err, r) {
                if (err) {
                    console.log(err);
                    res.json(err);
                } else {
                    console.log(r.user._id, r.user.ph, r.user.confirmed);
                    res.json({key: r.user.key});
                }
            });

        });

        app.get("/db", function (req, res) {

        });

        app.post("/db", function (req, res) {

        });
    }
};

module.exports = router;