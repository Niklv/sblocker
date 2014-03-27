var express = require("express");
var validator = require("validator");
var async = require("async");
var User = require("../models").models.user;
var log = require("../utils/log")(module);
var UsernameFormatError = require('../utils/errors').UsernameFormatError;
var PasswordFormatError = require('../utils/errors').PasswordFormatError;
var DuplicateError = require('../utils/errors').DuplicateError;
var DatabaseError = require('../utils/errors').DatabaseError;

var user = express.Router();

user.get('/', function (req, res) {

});

user.post('/login', function (req, res) {

});

user.post('/logout', function (req, res) {

});

user.post('/signup', function (req, res, next) {
    var u = req.body.u,
        p = req.body.p,
        e = req.body.u,
        imei = req.body.imei,
        ph = req.body.ph;

    if (!validator.isEmail(e) || e.length < 6)
        return next(new UsernameFormatError());
    if (!(typeof p === "string") || p.length < 6)
        return next(new PasswordFormatError());

    async.waterfall([
        function (cb) {
            User.findOne({$or: [
                {username: u},
                {password: p}
            ]}, cb);
        },
        function (user, cb) {
            if (user)
                return cb(new DuplicateError("User " + u + " already exist"));
            new User({
                username: u,
                email: e,
                password: p,
                imei: imei,
                ph: ph
            }).save(cb);
        },
        function (user, numberAffected, cb) {
            //TODO: generate auth link and send it user email
            cb(null, user);
        }
    ], function (err, user) {
        if (err)
            return next(err);
        res.send(200, {message: "OK"});
    });

/*
    user.save(function (err, user) {
        log.info(err.errors);
        //log.info(err.name);
        //log.info(err.number);
        //log.info(err.stackTrace);
        if (err)
            next(err);
        else
            res.send(200, {message: "OK"});
    });
*/

})
;

exports.router = user;




