var Benchmark = require('benchmark');
var request = require('request');
var User = require("../models/index").models.user;
var log = require("./log")(module);

function test(cb) {
    var options = {
        uri: "http://localhost:20301/api/user/signup",
        method: 'POST',
        json: {
            "u": "newuser@gmail.com", "p": "newpassword"
        }
    };
    var user = new User({
        username: 'newuser@gmail.com',
        email: 'newuser@gmail.com',
        password: 'newpassword'
    });
    request(options, function (error, response, body) {
        cb.resolve();
    });

}


function bench() {
    var suite = new Benchmark.Suite;

    var suit_opts = {
        defer: true,
        minSamples: 100
    };
    suite.add('PostNewUser#FindBeforeSave', function (cb) {
            test(cb)
        }, suit_opts
    ).on('cycle', function (event) {
            log.error(String(event.target));
        }
    ).on('complete', function () {
            log.error('Fastest is ' + this.filter('fastest').pluck('name'));
        }
    );
    //suite.run();
    log.error("Benchmark started");
    test({resolve: function () {console.log("done")}});
}


module.exports.bench = bench;
