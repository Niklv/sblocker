var express = require("express");
var fs = require("fs");
var path = require("path");
var async = require("async");
var config = require("../config");
var ServerError = require("../utils/error").ServerError;
var log = require('../utils/log')(module);
var tokenUtils = require('../controllers/token');
var User = require('../models').User;
var isDownloadDbLocked = false;

var api = express.Router();


function lockDbDownload(isLocked) {
    if (isLocked)
        log.debug("ClientDb download is locked");
    else
        log.debug("ClientDb download is unlocked");
    isDownloadLocked = isLocked;
}

function getUser(token) {

}

//Example token
//eyJhbGciOiJSUzI1NiIsImtpZCI6Ijk5ZDMxNjRiZDVmNjJmODk0N2YzZWUyNjZiNjIzNDA1M2Q2ZjJjZjAifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiaWQiOiIxMTE0ODQxMTQ4MDM3OTkwNDQzMjIiLCJzdWIiOiIxMTE0ODQxMTQ4MDM3OTkwNDQzMjIiLCJhenAiOiI0MDc0MDg3MTgxOTIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJlbWFpbCI6Im5pa2x2b3ZAZ21haWwuY29tIiwiYXRfaGFzaCI6ImpoUndrTk5heS1QZHE3Z2FuVC1jNGciLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXVkIjoiNDA3NDA4NzE4MTkyLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwidG9rZW5faGFzaCI6ImpoUndrTk5heS1QZHE3Z2FuVC1jNGciLCJ2ZXJpZmllZF9lbWFpbCI6dHJ1ZSwiY2lkIjoiNDA3NDA4NzE4MTkyLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiaWF0IjoxNDAxMTk2Mjg5LCJleHAiOjE0MDEyMDAxODl9.r6AxwvtSoxdfIZ931KNX4G9Wae6wLQyWSjEtOl62F0iH9fYtc_PBH3iFNQPRliVatV3WkIiw6l0VyJN9jUJFZBCEktFgCnJJw9vw4sUBFO-d5V4uAJMOiho7iPP0_5_xywfe4orXwrTtpME6QuQM5AUdcxdk8RTxmWxU2sWl7wo

api.use(function (req, res, next) {
    var params = req.query;
    if (!params.version)
        return next(new ServerError("Api version must be set", 1000, 400));
    if (params.version != 1)
        return next(new ServerError("Wrong API version", 1001, 400));
    if (!params.token)
        return next(new ServerError("Token must be set", 1002, 403));
    var decodedToken = tokenUtils.decodeToken(params.token);
    if (!decodedToken)
        return next(new ServerError("Token signature verification failed", 1003, 403));
    if (!tokenUtils.verifyToken(decodedToken))
        return next(new ServerError("Token verification failed", 1004, 403));
    async.waterfall([
        function (done) {
            User.findOne({email: decodedToken.email}, done);
        },
        function (user, done) {
            if (!user) {
                user = new User({
                    email: decodedToken.email,
                    isEmailVerified: decodedToken.email_verified,
                    createdAt: new Date()
                });
                user.save(done)
            } else if (user.isBanned)
                next(new ServerError("User banned", 1005, 403));
            else
                done(null, user);
        }
    ], function (err, user) {
        if (err)
            return next(err);
        req.decodedToken = decodedToken;
        req.user = user;
        console.log(decodedToken, user);
        next();
    });

});

api.get('/phone_db', function (req, res, next) {
    if (isDownloadDbLocked)
        next(new ServerError("Updating DB, try again in 2 minutes", 1106, 500));
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
            next(new ServerError("File serving error", 1105, 500));
    });
});

api.post('change_phone', function (req, res) {
    //TODO: POST NEW PHONES TO DB
    res.json(200, {status: 'In progress'});
});

module.exports.router = api;
module.exports.lockDbDownload = lockDbDownload;
