//Config
var nconf = require('nconf');
nconf.use('memory').argv().env();
if (nconf.get('NODE_ENV') != 'production') nconf.set('NODE_ENV', 'development');
nconf.add('env_config', {type: 'file', file: './config/' + nconf.get('NODE_ENV') + '.json'});
nconf.add('defaults', {type: 'file', file: './config/default.json'});

//libs
var _ = require('underscore');
var fs = require('fs');
var ECT = require('ect');
var express = require('express');
var http = require('http');
var https = require('https');
var bodyParser = require('body-parser');
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
    var ectRenderer = ECT({ watch: true, root: __dirname + '/views', ext: '.ect' });
    app.set('view engine', 'ect');
    app.engine('ect', ectRenderer.render);
    app.use('/', express.static(__dirname + '/public'));
    app.use(require('method-override')());
    app.use(require('compression')());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

    /*app.get('/fill_mongo', function (req, res, next) {
     var nums = [];
     for (var i = 0; i < 100; i++)
     nums[i] = {
     number: "" + (89060000000 + i),
     goodness: 20 + _.random(0, 20),
     createdAt: new Date
     };
     for (i = 100; i < 200; i++)
     nums[i] = {
     number: "" + (89050000000 + i),
     goodness: -20 - _.random(0, 20)
     };
     models.GlobalNumber.create(nums, function (err) {
     if (err)
     return next(err);
     res.send(200);
     });
     });*/
    app.use('/api', require('./routers/api').router);
    app.use('/admin/', require('./routers/admin').router);
    app.get('/', function (req, res) {
        res.json({status: 'server is running'});
    });
    app.use(error.PageNotFound);
    app.use(error.handler);
    require('./controllers/on_start')();
    app.cronJobs = require('./controllers/cron').setup();
    log.info("Server config complete!");
}

log.info("Launch in " + nconf.get('NODE_ENV'));
start();

var port = nconf.get("port");


https.createServer({
    cert: fs.readFileSync(nconf.get("security:server:cert"), 'utf8'),
    key: fs.readFileSync(nconf.get("security:server:key"), 'utf8')
}, app).listen(port.https, function () {
    log.info("HTTPS Express server listening on port " + port.https);
});


http.createServer(function (req, res) {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
}).listen(port.http, function () {
    log.info("HTTP Redirect server started at " + port.http);
});