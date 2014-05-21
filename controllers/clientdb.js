var cron = require('cron');
var models = require('../models');
var async = require('async');
var sqlite3 = require('sqlite3').verbose();
var path = require('path');
var log = require('../utils/log')(module);

function create() {
    log.info("Start creating clientDb");
    var dbpath = path.resolve(__dirname + "/../content/data/client.sqlite3");
    var db = new sqlite3.Database(dbpath, function (err) {
        if (err)
            log.error(err.message);
        else {
            //var recreate = db.serialize(function () {
                db.run("DROP TABLE IF EXISTS blacklist;");
                db.run("DROP TABLE IF EXISTS whitelist;");
                db.run("CREATE TABLE blacklist (phone STRING PRIMARY KEY);");
                db.run("CREATE TABLE whitelist (phone STRING PRIMARY KEY);");
                db.run("INSERT INTO blacklist VALUES ('123'), ('124');");
            //});
            //recreate.finalize();
            /*db.run("SELECT phone FROM blacklist", function (err, rows) {
                console.log(arguments);
                rows.forEach(function (row) {
                    console.log(row.id + ": " + row.info);
                });
            });*/
        }

        /*if (err)
         log.error(err.message);
         //console.log(err);
         else {
         log.info("Recreate tables");
         db.exec("DROP TABLE IF EXISTS 'blacklist'; " +
         "DROP TABLE IF EXISTS 'whitelist'; " +
         "CREATE TABLE 'blacklist' (phone string PRIMARY KEY); " +
         "CREATE TABLE 'whitelist' (phone string PRIMARY KEY);"
         , function (err) {
         if (err)
         log.error(err.message);
         else {
         log.info("Fill with data");
         //db.exec("");
         db.close();
         }

         });

         }*/


    });

    //async.waterfall(
//
//    );


}


module.exports = create;