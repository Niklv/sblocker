//libs
var fs = require('fs');
var express = require('express');
var http = require('http');
var https = require('https');
var config = require('./config');
var log = require('./utils/log')(module);
var error = require('./utils/error');
var models = require('./models');
var app = express();

function start() {
    log.info("Configure server");
    app.models = models;
    app.disable('x-powered-by');
    app.disable('etag');
    if (app.get('env') === 'development') {
        app.use(require('morgan')('dev'));
    }
    app.use(require('method-override')());
    app.use(require('compression')());
    app.use(require('method-override')());
    app.use(require('body-parser')());
    /*app.get('/fill_mongo', function (req, res, next) {
     var nums = [];
     for (var i = 0; i < 100; i++)
     nums[i] = {
     number: "" + (89060000000 + i),
     createdAt: new Date
     };
     models.Whitelist.create(nums, function (err) {
     if (err)
     return next(err);
     res.send(200);
     });
     });*/
    app.use('/api', require('./routers/api').router);
    app.get('/', function (req, res) {
        res.json({status: 'server is running'});
    });
    app.use(error.PageNotFound);
    app.use(error.handler);
    app.cronJobs = require('./controllers/cron').setup();
    require('./controllers/system_variable').initializeIfNotExist();
    log.info("Server config complete!");
}

start();

https.createServer({
    cert: fs.readFileSync(config.security.server.cert, 'utf8'),
    key: fs.readFileSync(config.security.server.key, 'utf8')
}, app).listen(config.https.port, function () {
    log.info("HTTPS Express server listening on port " + config.https.port);
});


http.createServer(function (req, res) {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
}).listen(config.http.port, function () {
    log.info("HTTP Redirect server started at " + config.http.port);
});



