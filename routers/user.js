var express = require("express");
var models = require("../models").models;

var user = express.Router();

user.get('/', function (req, res) {

});

user.post('/login', function (req, res) {

});

user.post('/signup', function (req, res) {

});



exports.router = user;
