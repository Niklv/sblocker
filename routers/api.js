var express = require("express");
var _ = require("underscore");
var fs = require("fs");
var path = require("path");
var async = require("async");
var config = require("../config");
var ServerError = require("../utils/error").ServerError;
var log = require('../utils/log')(module);
var tokenUtils = require('../controllers/token');
var Models = require('../models');
var User = Models.User;
var SystemVariable = Models.SystemVariable;
var TransitionalBlacklist = Models.TransitionalBlacklist;
var TransitionalWhitelist = Models.TransitionalWhitelist;
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


api.use(function (req, res, next) {
    var params = req.query;
    if (req.query.debug != undefined) //TODO: REMOVE THIS, ONLY FOR TEST
        return next();
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
                next(new ServerError("User " + user.email + " banned", 1005, 403));
            else
                done(null, user);
        }
    ], function (err, user) {
        if (err)
            return next(err);
        req.decodedToken = decodedToken;
        req.user = user;
        next();
    });

});

api.get('/phone_db', function (req, res, next) {
    if (isDownloadDbLocked)
        next(new ServerError("Updating DB, try again in 2 minutes", 1106, 500));
    var req_db_version = parseInt(req.get('If-None-Match'));
    SystemVariable.getClientDbVersion(function (err, version) {
        if (err || (version != req_db_version)) {
            var dbpath = path.resolve(__dirname + '/../' + config.data_path + config.clientdb.name + config.gzip_postfix);
            fs.exists(dbpath, function (exists) {
                if (exists) {
                    res.setHeader('Status Code', 200);
                    res.setHeader('Content-Type', 'application/x-sqlite3');
                    res.setHeader('Content-Encoding', 'gzip');
                    res.setHeader('ETag', version ? version : 0);
                    res.sendfile(dbpath, {}, function (err) {
                        if (err) {
                            log.error(err);
                            res.end();
                        }
                    });
                } else
                    next(new ServerError("File serving error", 1105, 500));
            });
        } else {
            res.send(304);
        }
    });
});

api.post('/change_phone', function (req, res, next) {
        var params = req.body;
        var userbl = [], userwl = [];
        try {
            if ((!params) || (typeof params.phone_list != 'object') || (!params.phone_list.length))
                return next(new ServerError("Wrong body content", 1201, 400));
            var data = params.phone_list;
            var phone = null, category = null;
            for (var i = 0; i < data.length; i++) {
                phone = data[i].phone;
                if (!phone || typeof phone != 'string' || !phone.length)
                    return next(new ServerError("Wrong body content", 1201, 400));
                category = data[i].category;
                if (!category || typeof category != 'string' || !category.length)
                    return next(new ServerError("Wrong body content", 1201, 400));
                phone = phone.toLowerCase();
                category = category.toLowerCase();
                if (category == 'black' || category == 'white')
                    userbl.push({phone: phone, category: category});
                else
                    return next(new ServerError("Wrong body content", 1201, 400));
            }
        } catch
            (err) {
            log.err(err);
            next(new ServerError("Wrong body content", 1201, 400));
        }

        async.waterfall([function(done){}], function(err, data){
            res.json({status: "InDev"});
        });


        /*
         async.parallel({
         blacklist: async.apply(processList, TransitionalBlacklist, userbl),
         whitelist: async.apply(processList, TransitionalWhitelist, userwl)
         }, function (err, result) {
         console.log(err);
         console.log(result);
         res.json({status: "InDev"});
         });*/
    }
);


function processList(model, data, done) {
    async.waterfall([
        async.apply(getUnexistedNumbers, model, data),
        function (existed, unexisted, done) {
            async.parallel({
                existed: async.apply(incExistedNumbers, model, existed),
                unexisted: async.apply(createUnexistedNumbers, model, unexisted)
            }, done);
        }
    ], done);
}

function getUnexistedNumbers(model, data, done) {
    async.waterfall([
        function (done) {
            model.distinct('number', {number: {$in: data}}, done)
        },
        function (existed, done) {
            done(null, existed, _.difference(data, existed));
        }
    ], done);
}

function incExistedNumbers(model, existed, done) {
    if (existed && existed.length)
        model.update({number: {$in: existed}}, {$inc: {occurrence: 1}}, function (err, data) {
            console.log(arguments);
            done(err, []);
        });
    else
        done(null, []);

}

function createUnexistedNumbers(model, unexisted, done) {
    log.info("createUnexistedNumbers", unexisted, model.modelName);
    if (unexisted && unexisted.length) {
        for (var i = 0; i < unexisted.length; i++)
            unexisted[i] = { number: unexisted[i] };
        model.create(unexisted, done);
    }
    else
        done(null, []);
}


module.exports.router = api;
module.exports.lockDbDownload = lockDbDownload;
