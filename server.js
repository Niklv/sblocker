var env = process.env;
var express = require('express');
var mongoose = require('mongoose');
var async = require('async');
var config = require('./utils/config');
var utils = require('./utils/utils');
var router = require('./router');
var models = require('./models/models');
var app = express();

function start() {
    async.auto({
        mongo: function (cb) {
            console.log("Init MongoDB");
            app.db = mongoose.connection;
            app.db.on("error", cb);
            app.db.once("open", cb);
            mongoose.connect(utils.getConnectionUrl());
            app.models = models;
        },
        redis: function (cb) {
            console.log("Init Redis");
            cb(null);
        },
        router: ['mongo', 'redis', function (cb) {
            console.log("Init router");
            cb(null);
        }],
        precompile: function (cb) {
            console.log("Precompile units");
            utils.generate_phone_regexp();
            utils.generate_code_regexp();
            cb(null);
        },
        server: ['router', function (cb) {
            console.log("Configure server");
            app.set('port', config[app.get("env")].port);
            router.bind(app);
            cb(null);
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
        test();
    });
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


function test() {
    //WARNING! DELETE ALL DATA
    /*app.models.blacklist.remove({},function(err,data){
     console.log(data);
     app.models.blacklist.find({},function(err,data){
     console.log(data);
     });
     });*/

    /*app.models.user.find({},function(err,data){
     console.log(data);
     });*/
    mongoose.connection.db.collectionNames(function (err, names) {
        console.log(names); // [{ name: 'dbname.myCollection' }]
    })

}


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