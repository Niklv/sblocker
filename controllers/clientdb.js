var cron = require('cron');
var models = require('../models');
var async = require('async');
var sqlite3 = require('sqlite3').verbose();
var path = require('path');
var log = require('../utils/log')(module);

function create() {
    log.info("Start creating clientDb");
    var dbpath = path.resolve(__dirname + "/../content/data/client.sqlite3")
    var db = new sqlite3.Database(dbpath, function (err) {
        if (err)
            log.error(err);
        else {
            log.info("Drop old tables");
            db.exec('DROP TABLE blacklist', function (err) {
                if (err)
                    log.error(err);
                else {
                    log.info("Create new tables");
                    db.exec('CREATE TABLE blacklist');
                    db.close();
                }

            });

        }


    });

    //async.waterfall(
//
//    );


}


module.exports = create;