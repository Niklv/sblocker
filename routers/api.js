var express = require("express");
var fs = require("fs");
var jwt = require('jwt-simple');
var path = require("path");
var config = require("../config");
var ServerError = require("../utils/error").ServerError;
var log = require('../utils/log')(module);
var isDownloadDbLocked = false;

var api = express.Router();


function lockDbDownload(isLocked){
    if(isLocked)
        log.debug("ClientDb download is locked");
    else
        log.debug("ClientDb download is unlocked");
    isDownloadLocked = isLocked;
}

function verifyToken(token) {
    var decoded = jwt.decode(token, "-----BEGIN CERTIFICATE-----\nMIICITCCAYqgAwIBAgIID6oI1BR2Z/0wDQYJKoZIhvcNAQEFBQAwNjE0MDIGA1UE\nAxMrZmVkZXJhdGVkLXNpZ25vbi5zeXN0ZW0uZ3NlcnZpY2VhY2NvdW50LmNvbTAe\nFw0xNDA1MjYxMDQzMzRaFw0xNDA1MjcyMzQzMzRaMDYxNDAyBgNVBAMTK2ZlZGVy\nYXRlZC1zaWdub24uc3lzdGVtLmdzZXJ2aWNlYWNjb3VudC5jb20wgZ8wDQYJKoZI\nhvcNAQEBBQADgY0AMIGJAoGBAOto6uN++hA9N3TGTUXdlNQ2lzGnhPq7IX7xEMPi\ncKSy0TTvrhABLDNGLj+tQ8kUE50tLtzwSwBEX9mzAxOymTTwzVq7w+KkRQ6SHbnk\nXNjHG4Y8+WOr59Tc0xY71b66Nay4Le5XqOU++bCJ6ZJKQQf/bzgDMNvpMiIYtJ1p\n394ZAgMBAAGjODA2MAwGA1UdEwEB/wQCMAAwDgYDVR0PAQH/BAQDAgeAMBYGA1Ud\nJQEB/wQMMAoGCCsGAQUFBwMCMA0GCSqGSIb3DQEBBQUAA4GBAMzAPSqyXVs91Pnc\niA5nU+V2vKYMC59AlS6nU9cAuxe9UoTFHb0SfmhApSgi1P3v3Tkj0zNFQ2/dnMWQ\nw1VorondhjBW6zQg3jv49dJTgJ8TDJWENOpgj89VxarGJPeqZeV/jE6rNJhg2iHp\n3ytiZ3Xv+mrwK4T/3KBp+Q2wbrUo\n-----END CERTIFICATE-----\n");
    log.info(decoded);
}

function getUser(token) {

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
    verifyToken(params.token);
    //TODO: FIND USER
    //TODO: IF NEW THEN ADD TO DB NEW USER
    //TODO: REQ.USER
    next();
});

api.get('/phone_db', function (req, res, next) {
    if(isDownloadDbLocked)
        next(new ServerError("Updating DB, try again in 2 minutes", 1005, 500));
    var dbpath = path.resolve(__dirname + '/../' + config.data_path + config.clientdb.name + config.gzip_postfix);
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
module.exports.lockDbDownload = lockDbDownload;
