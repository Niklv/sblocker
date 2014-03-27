var env = process.env;
//libs
var express = require('express');
var https = require('https');
var http = require('http');
//middleware
var bodyParser = require('body-parser');
var compress = require('compression');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
//modules
var config = require('./utils/config');
var utils = require('./utils/utils');
var error = require('./utils/errors');
var api = require('./routers/api');
var mongo = require('./models');
var log = require('./utils/log')(module);

var app = express();

function start() {
    log.info("Configure server");
    if (app.get('env') == 'development')
        app.use(morgan('dev'));
    app.use(compress());
    app.use(bodyParser());
    app.use(cookieParser());
    //app.use(methodOverride());
    app.use('/api', api.router);
    app.use(error.PageNotFound);
    app.use(error.handler);
    var httpPort = config[app.get("env")].http.port;
    http.createServer(app).listen(httpPort).on('listening', function () {
        log.info("Http bound to " + httpPort + " port");
    });

    //var httpsPort = config[app.get("env")].https.port;
    //var options = config[app.get("env")].https.options;
    //https.createServer(options, app).listen(httpsPort);
    //log.info("Https bound to " + httpsPort + " port");
    log.info("Server start complete!");
}

start();
setTimeout(require('./utils/benchmark').bench, 2000);