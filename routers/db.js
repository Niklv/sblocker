var express = require("express");
var models = require("../models").models;
var DatabaseError = require("../utils/errors").DatabaseError;

var db = express.Router();

db.use(function (req, res, next) {
    if (req.app.db.readyState)
        next();
    else
        next(new DatabaseError("Not connected to db"));


});

db.get('/blacklist', function (req, res) {
    //TODO: cache and check for cache
    models.blacklist.find({}, {ph: 1, bl: 1, r: 1, _id: 0}, function (err, data) {
        if (err)
            res.json(error(3, err));
        else
            res.json({list: data, time: new Date().getTime()});
    });
});

db.get('/reasons', function (req, res) {
    models.reason.find({}, {desc: 1, n: 1, _id: 0}, function (err, data) {
        if (err)
            res.json(error(3, err));
        else
            res.json({reasons: data, time: new Date().getTime()});
    });
});

db.get('/types', function (req, res) {
    models.type.find({}, {desc: 1, n: 1, _id: 0}, function (err, data) {
        if (err)
            res.json(error(3, err));
        else
            res.json({types: data, time: new Date().getTime()});
    });
});

exports.router = db;