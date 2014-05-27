//libs
var express = require('express');
var http = require('http');
var config = require('./config');
var log = require('./utils/log')(module);
var error = require('./utils/error');
var models = require('./models');
var app = express();

function start() {
    log.info("Configure server");
    app.models = models;
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
                number: "" + (89160000000 + i),
                createdAt: new Date
            };
        models.Blacklist.create(nums, function (err) {
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
    log.info("Server config complete!");
}

start();

var httpPort = config.http.port;
app.listen(httpPort);
log.info("Server start at " + httpPort);
//require('./controllers/token').updateCertificates();
//require('./controllers/clientdb')();
app.cronJobs = require('./controllers/cron').setup();


