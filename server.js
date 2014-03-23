var env = process.env;
//libs
var express = require('express');
var https = require('https');
var http = require('http');
var async = require('async');
//middleware
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var compress = require('compression');
var morgan = require('morgan');//var errorHandler = require('errorhandler');
//modules
var config = require('./utils/config');
var utils = require('./utils/utils');
var api = require('./routers/api');
var mongo = require('./models');
var log = require('./utils/log')(module);

var app = express();
app.models = mongo.models;
app.db = mongo.db;

function start() {
    utils.generate_phone_regexp();
    log.info("Configure server");
    app.use(morgan('dev'));
    app.use(compress());
    app.use(bodyParser());
    app.use(methodOverride());
    app.use('/api', api.router);
    var httpPort = config[app.get("env")].http.port;
    http.createServer(app).listen(httpPort);
    log.info("Http bound to " + httpPort + " port");
    //var httpsPort = config[app.get("env")].https.port;
    //var options = config[app.get("env")].https.options;
    //https.createServer(options, app).listen(httpsPort);
    //log.info("Https bound to " + httpsPort + " port");
    log.info("Server start complete!");
}

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
    /*mongoose.connection.db.collectionNames(function (err, names) {
     console.log(names); // [{ name: 'dbname.myCollection' }]
     })*/
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