var express = require("express");
var _ = require("underscore");
var async = require("async");
var nconf = require("nconf");
var ServerError = require("../../../utils/error").ServerError;
var log = require('../../../controllers/log')(module);
var Models = require('../../../models');
var User = Models.User;

var router = express.Router();

router.post('/android_reg_id', function (req, res, next) {
    var params = req.body,
        regId = null;
    if ((!params)
        || !_.has(params, "registrationId")
        || !(typeof params.registrationId == "string")
        || !params.registrationId.length)
        return next(new ServerError("Wrong body content", 1301, 400));
    req.user.androidRegistrationId = params.registrationId;
    req.user.save(function (err, user) {
        if (err) {
            log.info(err.stack);
            return next(new ServerError("Database error while updating", 1302, 500));
        }
        res.json(200, {result: "success"});
    });
});


router.delete('/android_reg_id', function (req, res, next) {
    req.user.androidRegistrationId = undefined;
    req.user.save(function (err, user) {
        if (err) {
            log.info(err.stack);
            return next(new ServerError("Database error while updating", 1401, 500));
        }
        res.json(200, {result: "success"});
    });
});

module.exports.router = router;

