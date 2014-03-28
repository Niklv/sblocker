/*global describe, it, before, beforeEach, after, afterEach*/
var chai = require('chai'),
    expect = chai.expect,
    should = chai.should();
chai.config.includeStack = true;
var request = require("request");
var async = require("async");

describe('Api', function () {
    describe('User', function () {
        var options = {
            uri: "http://localhost:20301/api/user/signup",
            method: 'POST',
            json: {
                "u": "TestUser@TestMail.com",
                "p": "newpassword"
            }
        };

        describe('#signup', function () {
            it('should return HTTP500 and message when not valid json', function (done) {
                request("http://localhost:20301/api/user/signup", {
                    method: 'POST',
                    json: 124141512
                }, function (err, res) {
                    res.statusCode.should.be.equal(500);
                    done(err);
                });
            });
            it('should return HTTP406 and error when username not valid', function (done) {
                async.series(
                    [
                        function (cb) {
                            request("http://localhost:20301/api/user/signup", {
                                method: 'POST',
                                json: {
                                    "p": "newpassword"
                                }
                            }, function (err, res) {
                                res.statusCode.should.be.equal(406);
                                res.body.should.have.property('err').be.equal('UsernameFormatError');
                                cb(err);
                            });
                        },
                        function (cb) {
                            request("http://localhost:20301/api/user/signup", {
                                method: 'POST',
                                json: {
                                    "u": "TestUserTestMail.com",
                                    "p": "newpassword"
                                }
                            }, function (err, res) {
                                res.statusCode.should.be.equal(406);
                                res.body.should.have.property('err').be.equal('UsernameFormatError');
                                cb(err);
                            });
                        },
                        function (cb) {
                            request("http://localhost:20301/api/user/signup", {
                                method: 'POST',
                                json: {
                                    "u": "t",
                                    "p": "newpassword"
                                }
                            }, function (err, res) {
                                res.statusCode.should.be.equal(406);
                                res.body.should.have.property('err').be.equal('UsernameFormatError');
                                cb(err);
                            });
                        },
                        function (cb) {
                            request("http://localhost:20301/api/user/signup", {
                                method: 'POST',
                                json: {
                                    "u": "osyc5316hrhdrhhdjrjdbrjsbsrbsrjvsjdhvjhvlj146ashvjsvlsvljvshveljv@lszrbbzrblkbgzjkbrgzbrbkzzr136643.gszgrbslegvlse",
                                    "p": "newpassword"
                                }
                            }, function (err, res) {
                                res.statusCode.should.be.equal(406);
                                res.body.should.have.property('err').be.equal('UsernameFormatError');
                                cb(err);
                            });
                        }
                    ],
                    function (err) {
                        done(err);
                    }
                );
            });
            it('should return HTTP400 and message when password not valid', function (done) {
                done();
            });
            it('should return HTTP201, message and token when username and password is ok', function (done) {
                done();
            });
            it('should return HTTP409, message and token when username and password is ok and already exist in DB', function (done) {
                done();
            });
            it('should return HTTP409, message and token when username and password is ok and already exist in DB', function (done) {
                done();
            });
        });
    });
    describe('Db', function () {

    });

    it('should return HTTP500 when DB not work', function (done) {
        done();
    });
    it('should return HTTP404 when wrong page', function (done) {
        done();
    });
});


/*request(options, function (error, response, body) {
 should.not.exist(error);
 response.statusCode.should.equal(200);
 done();
 });*/