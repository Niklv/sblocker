//libs
var express = require('express');
var http = require('http');
var config = require('./config');
var log = require('./utils/log')(module);

var app = express();

function start() {
    log.info("Configure server");
    if (app.get('env') === 'development') {
        app.use(require('morgan')('dev'));
    }
    app.use(require('compression')());
    app.use(require('body-parser')());
    app.use(require('method-override')());
    app.use('/api', require('./routers/api').router);
    app.use('/', function (req, res) {
        res.json({status: 'server is running'});
    });
    //app.use(error.PageNotFound);
    //app.use(error.handler);
    log.info("Server config complete!");
}

start();

var httpPort = config.http.port;
http.createServer(app).listen(httpPort).on('listening', function () {
    log.info("Http bound to " + httpPort + " port");
});

