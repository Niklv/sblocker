var env = process.env;
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var mongo = {
    user: "developer",
    pwd: "fwaocbnw3rwctn38ctfgw38x4nt0crtfnzxmg4t30nwct043",
    url: "37.139.15.10:27017",
    db: "sblocker"
};





mongoose.connect('mongodb://' + mongo.user + ':' + mongo.pwd + '@' + mongo.url + '/' + mongo.db);

app.get("/db", function (req, res) {
    app.db.blaclist.find(function (err, data) {
        if (err) {
            console.log(err);
            res.json({err: "Error while getting data from db"})
        }
        else
            res.json({db:data});

    });
});

app.db = mongoose.connection;
app.db.on("error", function (err) {
    console.log(err);
});
app.db.once("open", function () {
    console.log("connection to mongo - ok");
    app.db.blaclist = mongoose.model('blacklist', new mongoose.Schema({
        ph: String,
        time: Number
    }));
    /*var black_number = new app.db.blaclist({
     ph:"SPAM_NUMBER",
     time: new Date().getTime()
     }).save(function(err, num){console.log(err, num)});*/
    /*app.db.blaclist.find(function (err, data) {
     console.log(data)
     });*/
});

app.configure("production", function () {
    app.listen(20300);
    console.log("Listen on 20300!");
});

app.configure("development", function () {
    app.listen(20301);
    console.log("Listen on 20301!");
});