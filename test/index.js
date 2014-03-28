/*global describe, it, before, beforeEach, after, afterEach*/

var request = require("request");

describe('UserModel', function () {
    var options = {
        uri: "http://localhost:20301/api/user/signup",
        method: 'POST',
        json: {
            "u": "newuser10@gmail.com",
            "p": "newpassword"
        }
    };
    before(function () {

    });
    describe('#registration', function () {
        it('should return token when user register', function (done) {
            request(options, function (error, response, body) {
                should.not.exist(error);
                response.statusCode.should.equal(200);
                done();
            });
        });
    });
});
