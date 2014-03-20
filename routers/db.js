var express = require("express");

var db = express.Router();

db.get('/blacklist', function (req, res) {
});

db.get('/reasons', function (req, res) {
});

db.get('/types', function (req, res) {
});

module.exports.router = db;