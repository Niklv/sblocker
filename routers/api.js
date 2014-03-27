var express = require("express");
var mongo = require("../models").db;
var db = require("./db");
var user = require("./user");

var api = express.Router();
api.use(function (req, res, next) {
    if (mongo.readyState)
        next();
    else
        next(new DatabaseError("Not connected to db"));
});
api.use('/db', db.router);
api.use('/user', user.router);


module.exports.router = api;
