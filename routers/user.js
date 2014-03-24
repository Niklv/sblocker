var express = require("express");
var validator = require("validator");
var models = require("../models").models;
var log = require("../utils/log")(module);
var UsernameError = require('../utils/errors').UsernameError;
var PasswordError = require('../utils/errors').PasswordError;

var user = express.Router();

user.use('/', function (req, res, next) {
    if (req.app.db.readyState)
        next();
    else
        res.send(500);
});


user.get('/', function (req, res) {

});

user.post('/login', function (req, res) {

});

user.post('/signup', function (req, res) {
    var u = req.body.u, p = req.body.p;
    log.info(u, p);
    if (!validator.isEmail(u) || u.length < 6) {
        throw new UsernameError("Wrong email");
    }
    if (!(typeof p === "string") || p.length < 6) {
        throw new PasswordError("Wrong password");
    }

    console.log("here");


    res.send(200);
});


exports.router = user;
