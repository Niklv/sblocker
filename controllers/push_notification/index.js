var _ = require('underscore');
var async = require('async');
var android = require('./android');
var log = require('../../utils/log')(module);
var models = require('../../models');
var User = models.User;
var SystemVariable = models.SystemVariable;


function pushClientDbUpdate(callback) {
    async.waterfall([
        function (done) {
            SystemVariable.getClientDbVersion(done);
        },
        function (version, done) {
            var stream = User.find({
                    androidRegistrationId: {$exists: true},
                    //isBanned: false,
                    isEmailVerified: true},
                {androidRegistrationId: 1}/*,
                 function (err, data) {
                 done(err, data, version);
                 }*/).stream();

            var chunk1000 = [];
            stream.on('data', function (doc) {
                console.log(chunk1000.length);
                if (chunk1000.length < 1000)
                    chunk1000.push(doc);
                else
                    chunk1000 = [doc];
                // do something with the mongoose document
            }).on('error', function (err) {
                // handle the error
                console.log('error', err);
            }).on('close', function () {
                // the stream is closed
                console.log('close');
                done(null, null, null);
            });
        },
        function (regIds, version, done) {
            /*
             var chunks = [];
             log.info("Start add");
             for (var i = 0; i < 99999999; i++)
             regIds.push(i);
             log.info("Start slice");
             var j, chunk = 1000;
             for (i = 0, j = regIds.length; i < j; i += chunk) {
             chunks = regIds.slice(i, i + chunk);
             // do whatever
             }
             log.info("End slice");
             log.info(chunks.length);*/
            done()
        },
        function (done) {
            //analyze errors from gcm send
            done()
        }
    ], function (err, data) {
        callback && callback(err, data);
    });


}

module.exports.pushClientDbUpdate = pushClientDbUpdate;
module.exports.android = require('./android');
