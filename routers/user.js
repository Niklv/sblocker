var express = require("express");
var validator = require("validator");
var db = require("../models").db;
var User = require("../models").models.user;
var log = require("../utils/log")(module);
var UsernameFormatError = require('../utils/errors').UsernameFormatError;
var PasswordFormatError = require('../utils/errors').PasswordFormatError;
var DuplicateError = require('../utils/errors').DuplicateError;
var DatabaseError = require('../utils/errors').DatabaseError;

var user = express.Router();

user.use('/', function (req, res, next) {
    if (db.readyState)
        next();
    else
        next(new DatabaseError("Not connected to db"));
});


user.get('/', function (req, res) {

});

user.post('/login', function (req, res) {

});

user.post('/signup', function (req, res, next) {
    var u = req.body.u, p = req.body.p, e = req.body.u,
        imei = req.body.imei, ph = req.body.ph;
    //log.info(u, p);
    if (!validator.isEmail(e) || e.length < 6) {
        next(new UsernameFormatError());
    } else if (!(typeof p === "string") || p.length < 6) {
        next(new PasswordFormatError());
    } else { //all is ok
        var user = new User({
            username: u,
            email: e,
            password: p,
            imei: imei,
            ph: ph
        });
        user.save(function (err, user) {
            if (err)
                next(err);
            else
                res.send(200, {message: "Check your email"});
        });
    }
});

exports.router = user;




