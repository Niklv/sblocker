var Benchmark = require('benchmark');
var request = require('request');

var suite = new Benchmark.Suite;


var options = {
    uri: "http://localhost:20301/api/user/signup",
    method: 'POST',
    json: {
        "u": "newuser@gmail.com", "p": "newpassword"
    }
};



// add tests
suite.add('PostNewUser#test', function (cb) {
    request(options, function (error, response, body) {

    });
})
    // add listeners
    .on('cycle', function (event) {
        console.log(String(event.target));
    })
    .on('complete', function () {
        console.log('Fastest is ' + this.filter('fastest').pluck('name'));
    })
    // run async
    .run({ 'async': true });