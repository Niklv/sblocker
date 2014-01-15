var env = process.env;
var express = require('express');
var mongoose = require('mongoose');
var async = require('async');
var config = require('./config');
var utils = require('./utils');
var router = require('./router');
var app = express();

function start() {
    async.auto({
        mongo: function (cb) {
            console.log("mongo");
            app.db = mongoose.connection;
            app.db.on("error", cb);
            app.db.once("open", cb);
            mongoose.connect(utils.getConnectionUrl());
        },
        schemas: ['mongo', function (cb) {
            console.log("schemas");
            cb(null);
        }],
        redis: function (cb) {
            console.log("redis");
            cb(null);
        },
        router: ['mongo', 'redis', function (cb) {
            console.log("router");
            cb(null);
        }],
        precompile: function(cb){
            console.log("precompile");
            utils.generate_phone_regexp();
            cb(null);
        },
        server: ['router', function (cb) {
            console.log("server");
            app.set('port', config[app.get("env")].port);
            app.configure("production", function () {//prod config
                production();
                cb(null);
            });
            app.configure("development", function () {//dev config
                development();
                cb(null);
            });
        }],
        start: ['server', 'precompile', function (cb) {
            var port = app.get('port');
            app.listen(port);
            console.log("Bound to " + port + " port");
            cb(null);
        }]
    }, function (err) {
        if (err)
            console.log("Server start failed: " + err);
        else
            console.log("Server start complete!");
    });
}

function production() {
    app.use(express.errorHandler());
    router.bind(app);
}

function development() {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    router.bind(app);
}



/*app.get("/db", function (req, res) {
 app.db.blaclist.find(function (err, data) {
 if (err) {
 console.log(err);
 res.json({err: "Error while getting data from db"})
 }
 else
 res.json({db: data});

 });
 });

*/

start();


/*var black_number = new app.db.blaclist({
 ph:"SPAM_NUMBER",
 time: new Date().getTime()
 }).save(function(err, num){console.log(err, num)});*/
/*app.db.blaclist.find(function (err, data) {
 console.log(data)
 });
 app.db.blaclist = mongoose.model('blacklist', new mongoose.Schema({
 ph: String,
 time: Number
 }));
 */