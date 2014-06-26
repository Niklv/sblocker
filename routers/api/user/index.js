var express = require("express");
var _ = require("underscore");
var async = require("async");
var nconf = require("nconf");
var ServerError = require("../../../utils/error").ServerError;
var log = require('../../../utils/log')(module);
var Models = require('../../../models');
var User = Models.User;

var router = express.Router();

router.post('/android_reg_id', function (req, res, next) {


    res.json(200, {status: "in dev"});
});


router.delete('/android_reg_id', function (req, res, next) {



    res.json(200, {status: "in dev"});
});

module.exports.router = router;

