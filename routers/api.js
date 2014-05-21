var express = require("express");
var ServerError = require("../utils/error").ServerError;
var log = require('../utils/log')(module);

var api = express.Router();


function verifyToken(token) {

}

api.use(function (req, res, next) {
    var params = {};
    if (req.method === 'GET')
        params = req.query;
    else
        params = req.body;
    if (!params.version)
        return next(new ServerError("Api version must be set", 1000, 400));
    if (params.version != 1)
        return next(new ServerError("Wrong API version", 1001, 400));
    if (!params.token)
        return next(new ServerError("Token must be set", 1002, 400));


    //TODO: JSON WEB TOKEN VALIDATION
    //TODO: FIND USER
    //TODO: IF NEW THEN ADD TO DB NEW USER
    //TODO: REQ.USER
    next();
});

api.get('/phone_db', function (req, res) {
    //TODO: GET PHONES DB
    res.json(200, {status: 'In progress'});
});

api.post('change_phone', function (req, res) {
    //TODO: POST NEW PHONES TO DB
    res.json(200, {status: 'In progress'});
});

module.exports.router = api;
