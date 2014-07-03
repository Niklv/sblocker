var fs = require('fs');
var zlib = require('zlib');
var nconf = require('nconf');
var models = require('../models');
var GlobalNumber = models.GlobalNumber;
var SystemVariable = models.SystemVariable;
var async = require('async');
var sqlite3 = require('sqlite3').verbose();
var path = require('path');
var log = require('./log')(module);

var lockDbDownload = require('../routers/api').lockDbDownload;


var DB_FILE_NAME = nconf.get("clientdb:name");
var TABLE_NAME = nconf.get("clientdb:table_name");
var TEMP_POSTFIX = nconf.get("temp_postfix");
var GZIP_POSTFIX = nconf.get("gzip_postfix");
var DATA_PATH = "/../" + nconf.get("data_path");
var DB_PATH = path.resolve(__dirname + DATA_PATH + DB_FILE_NAME);
var GZIPPED_PATH = DB_PATH + GZIP_POSTFIX;
var TEMP_PATH = DB_PATH + TEMP_POSTFIX;


function create(callback) {
    log.info("Start creating clientDB");
    var db = null;
    async.waterfall([
            function (done) {
                log.debug("Check for old temp file");
                fs.exists(TEMP_PATH, function (exists) {
                    if (exists) {
                        log.debug("Old temp file found, delete");
                        fs.unlink(TEMP_PATH, done);
                    } else {
                        log.debug("Old temp file not found");
                        done();
                    }
                });
            },
            function (done) {
                log.debug("Create new temp file");
                db = new sqlite3.Database(TEMP_PATH, done);
            },
            function (done) {
                log.debug("Create db structure");
                db.serialize(function () {
                    db.run("DROP TABLE IF EXISTS " + TABLE_NAME);
                    db.run("CREATE TABLE " + TABLE_NAME + " (number STRING PRIMARY KEY, spamProbability INT)");
                    done();
                });
            },
            function (done) {
                log.debug("Aggregate global numbers");
                GlobalNumber.aggregate(
                    {$match: {$or: [
                        {goodness: {$gte: nconf.get("criteria:wl")}},
                        {goodness: {$lte: -nconf.get("criteria:bl")}}
                    ]}},
                    {$project: {
                        _id: 0,
                        number: 1,
                        spamProbability: {$cond: [
                            {$gt: [ "$goodness", 0 ]},
                            0,
                            1
                        ]}
                    }},
                    done
                );
            },
            function (rows, done) {
                log.debug("Prepare SQL statement");
                var stmt = db.prepare("INSERT INTO " + TABLE_NAME + " VALUES (?, ?)");
                async.each(rows, function (item, cb) {
                    stmt.run(item.number, item.spamProbability, cb);
                }, function (err) {
                    done(err, stmt);
                });
            },
            function (stmt, done) {
                log.debug("Execute SQL statement");
                stmt.finalize(done);
            },
            function (done) {
                log.debug("Close temp db");
                db.close(done);
            },
            function (done) {
                lockDbDownload(true);
                log.debug("Check for current db file");
                fs.exists(DB_PATH, function (exists) {
                    if (exists) {
                        log.debug("Current db file found, delete");
                        fs.unlink(DB_PATH, done);
                    } else {
                        log.debug("Current db file not found");
                        done();
                    }
                });
            },
            function (done) {
                log.debug("Rename temp to current");
                fs.rename(TEMP_PATH, DB_PATH, done);
            },
            function (done) {
                log.debug("Check for current gzipped db file");
                fs.exists(GZIPPED_PATH, function (exists) {
                    if (exists) {
                        log.debug("Current gzipped db file found, delete");
                        fs.unlink(GZIPPED_PATH, done);
                    } else {
                        log.debug("Current gzipped db file not found");
                        done();
                    }
                });
            },
            function (done) {
                log.debug("gZip current db");
                var raw = fs.createReadStream(DB_PATH);
                var gzipped = fs.createWriteStream(GZIPPED_PATH);
                raw.pipe(zlib.createGzip({level: 9})).pipe(gzipped);
                gzipped.on('close', done);
                gzipped.on('error', done);
            },
            function (done) {
                log.debug("Updete db version number");
                SystemVariable.incClientDbVersion(done);
            }
        ],
        function (err, version) {
            lockDbDownload(false);
            if (err)
                log.error(err);
            else
                log.info("New client DB v" + version + " created");
            callback && callback(err, version);
        }
    );
}

module.exports.create = create;