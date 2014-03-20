var express = require("express");
var db = require("./db");
var user = require("./user");

var api = express.Router();
api.use('/db', db.router);
api.use('/user', user.router);


module.exports.router = api;
