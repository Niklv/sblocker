var fs = require('fs');
var zlib = require('zlib');
var cron = require('cron');
var models = require('../models');
var async = require('async');
var sqlite3 = require('sqlite3').verbose();
var path = require('path');
var log = require('../utils/log')(module);
var config = require('../config');


var DB_NAME = config.clientdb.name;
var TEMP_POSTFIX = config.temp_postfix;
var GZIP_POSTFIX = config.gzip_postfix;
var DATA_PATH = "/../" + config.data_path;
var DB_PATH = path.resolve(__dirname + DATA_PATH + DB_NAME);
var GZIPPED_PATH = DB_PATH + GZIP_POSTFIX;
var TEMP_PATH = DB_PATH + TEMP_POSTFIX;


function create() {
    log.info("Start creating clientDB");
    var db;
    async.waterfall([
            function (done) {
                log.info("Check for old temp file");
                fs.exists(TEMP_PATH, function (exists) {
                    if (exists) {
                        log.info("Old temp file found, delete");
                        fs.unlink(TEMP_PATH, done);
                    } else {
                        log.info("Old temp file not found");
                        done();
                    }
                });
            },
            function (done) {
                log.info("Create new temp file");
                db = new sqlite3.Database(TEMP_PATH, done);
            },
            function (done) {
                log.info("Create db structure");
                db.serialize(function () {
                    db.run("DROP TABLE IF EXISTS blacklist");
                    db.run("DROP TABLE IF EXISTS whitelist");
                    db.run("CREATE TABLE blacklist (phone STRING PRIMARY KEY)");
                    db.run("CREATE TABLE whitelist (phone STRING PRIMARY KEY)");
                    done();
                });
            },
            function (done) {
                fillClientSliteDb(db, models.Blacklist, 'blacklist', done);
            },
            function (done) {
                fillClientSliteDb(db, models.Whitelist, 'whitelist', done);
            },
            function (done) {
                log.info("Close temp db");
                db.close(done);
            },
            function (done) {
                log.info("Check for current db file");
                fs.exists(DB_PATH, function (exists) {
                    if (exists) {
                        log.info("Current db file found, delete");
                        fs.unlink(DB_PATH, done);
                    } else {
                        log.info("Current db file not found");
                        done();
                    }
                });
            },
            function (done) {
                log.info("Rename temp to current");
                fs.rename(TEMP_PATH, DB_PATH, done);
            },
            function (done) {
                log.info("Check for current gzipped db file");
                fs.exists(GZIPPED_PATH, function (exists) {
                    if (exists) {
                        log.info("Current gzipped db file found, delete");
                        fs.unlink(GZIPPED_PATH, done);
                    } else {
                        log.info("Current gzipped db file not found");
                        done();
                    }
                });
            },
            function (done) {
                log.info("gZip current db");
                var raw = fs.createReadStream(DB_PATH);
                var gzipped = fs.createWriteStream(GZIPPED_PATH);
                raw.pipe(zlib.createGzip({level: 9})).pipe(gzipped);
                gzipped.on('close', done);
                gzipped.on('error', done);
            }
        ],
        function (err) {
            if (err)
                console.log(err);
            else
                log.info("New client DB created");
        }
    );
}


function fillClientSliteDb(sqlitedb, mongooseModel, tableName, cb) {
    async.waterfall([
        function (done) {
            log.info("Find " + mongooseModel.modelName + " numbers");
            mongooseModel.find({}, done);
        },
        function (rows, done) {
            log.info("Prepare SQL statement");
            var stmt = sqlitedb.prepare("INSERT INTO " + tableName + " VALUES (?)");
            async.each(rows, function (item, cb) {
                stmt.run(item.number, cb);
            }, function (err) {
                done(err, stmt);
            });
        }, function (stmt, done) {
            log.info("Execute SQL statement");
            stmt.finalize(done);
        }
    ], cb);
}


module.exports = create;