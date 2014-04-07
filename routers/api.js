var express = require("express");
var mongo = require("../models").db;
var db = require("./db");
var user = require("./user");
var DatabaseError = require("../utils/errors").DatabaseError;

var api = express.Router();
api.use(function (req, res, next) {
    if (!mongo.readyState) {
        return next(new DatabaseError("Not connected to db"));
    }
    next();
});
api.use('/db', db.router);
api.use('/user', user.router);


module.exports.router = api;
