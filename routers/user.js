var express = require("express");
var crypto = require("crypto");
var validator = require("validator");
var async = require("async");
var User = require("../models").models.user;
var Token = require("../models").models.token;
var config = require("../utils/config");
var log = require("../utils/log")(module);
var UsernameFormatError = require('../utils/errors').UsernameFormatError;
var PasswordFormatError = require('../utils/errors').PasswordFormatError;
var SidFormatError = require('../utils/errors').SidFormatError;
var DuplicateError = require('../utils/errors').DuplicateError;
var DatabaseError = require('../utils/errors').DatabaseError;


var user = express.Router();

user.post('/login', function (req, res, next) {
    var u = req.body.u,
        p = req.body.p;

    if (!(typeof u === "string") || !validator.isEmail(u) || u.length < 6 || u.length > 60) {
        return next(new UsernameFormatError());
    }
    if (!(typeof p === "string") || p.length < 6 || p.length > 60) {
        return next(new PasswordFormatError());
    }

    async.waterfall([
        function (cb) {
            User.findOne({$or: [
                {username: u},
                {password: p}
            ]}, cb);
        },
        function (user, cb) {
            if (user && user.checkPassword(p)) {
                cb(null, user);
            } else {
                cb(401);
            }
        },
        function (user, cb) {
            user.generateToken(cb);
        }
    ], function (err, user, token) {
        if (err === 401) {
            res.send(401, {message: "Wrong username or password"});
        } else if (err) {
            next(err);
        } else {
            res.send(200, {message: "OK", token: token.token});
        }
    });

});

user.post('/signup', function (req, res, next) {
    var u = req.body.u,
        p = req.body.p,
        e = req.body.u,
        imei = req.body.imei,
        ph = req.body.ph;

    if (!(typeof e === "string") || !validator.isEmail(e) || e.length < 6 || e.length > 60) {
        return next(new UsernameFormatError());
    }
    if (!(typeof p === "string") || p.length < 6 || p.length > 60) {
        return next(new PasswordFormatError());
    }

    async.waterfall([
        function (cb) {
            User.findOne({$or: [
                {username: u},
                {password: p}
            ]}, cb);
        },
        function (user, cb) {
            if (user) {
                return cb(new DuplicateError("User " + u + " already exist"));
            }
            new User({
                username: u,
                email: e,
                password: p,
                imei: imei,
                ph: ph
            }).save(cb);
        },
        function (user, numberAffected, cb) {
            user.sendAuthMail(cb);
        },
        function (user, cb) {
            user.generateToken(cb);
        }
    ], function (err, user, token) {
        if (err) {
            return next(err);
        }
        res.send(200, {message: "OK", token: token.token});
    });
});

user.param('user', function (req, res, next, username) {
    User.findOne({username: username}, function (err, user) {
        if (err) {
            return next(new DatabaseError());
        }
        if (!user) {
            return next(403);
        }
        Token.findOne({user: user._id}, function (err, token) {
            if (err) {
                return next(new DatabaseError());
            }
            if (!token) {
                return next(403);
            }
            req.user = user;
            req.user_token = token;
            next();
        });

    });
});

user.post('/:user/logout', function (req, res, next) {
    var sid = req.body.sid, server_sid = null;
    if ((typeof sid !== "string") || (!validator.isHexadecimal(sid)) || (sid.length !== 32)) {
        return next(new SidFormatError());
    }
    async.waterfall([

    ], function (err) {

    });

    server_sid = Token.sid(req.user.username + "logout" + req.user_token.token);
    if (server_sid !== sid) {
        next(403);
    } else {
        req.user_token.remove(function(err){
            if(err){
                return new DatabaseError();
            }
            res.send(200);
        });
    }
});


exports.router = user;




