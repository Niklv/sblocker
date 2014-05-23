var express = require("express");
var fs = require("fs");
var path = require("path");
var config = require("../config");
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
        return next(new ServerError("Token must be set", 1002, 403));


    //TODO: JSON WEB TOKEN VALIDATION
    //TODO: FIND USER
    //TODO: IF NEW THEN ADD TO DB NEW USER
    //TODO: REQ.USER
    next();
});

api.get('/phone_db', function (req, res, next) {
    var dbpath = path.resolve(__dirname + '/../'
        + config.data_path + config.clientdb.name + config.gzip_postfix);
    fs.exists(dbpath, function (exists) {
        if (exists) {
            res.setHeader('Status Code', 200);
            res.setHeader('Content-Type', 'application/x-sqlite3');
            res.setHeader('Content-Encoding', 'gzip');
            res.sendfile(dbpath, {}, function (err) {
                if (err) {
                    log.error(err);
                    res.end();
                }
            });
        } else
            next(new ServerError("File serving error", 1004, 500));
    });
});

api.post('change_phone', function (req, res) {
    //TODO: POST NEW PHONES TO DB
    res.json(200, {status: 'In progress'});
});

module.exports.router = api;
