/*global describe, it, before, beforeEach, after, afterEach*/
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
var server = require("../server").app;
//app.listen(3000, function(){});
var request = require('supertest');
var app = request(server);
var async = require("async");

chai.config.includeStack = true;

/**/

describe('Api', function () {
    describe('User', function () {
        describe('#signup', function () {
            it("sould return 500 when not valid json", function (done) {
                app.post('/api/user/signup').type('json').send("nojson").expect(500, done);
            });
            it("sould return 406 when username not set", function (done) {
                app.post('/api/user/signup').type('json').send({"p": "newpassword"}).expect(406, done);
            });
            it("sould return 406 when username not valid", function (done) {
                async.series([
                    function (cb) {
                        app.post('/api/user/signup').type('json').send({"u": "            ", "p": "newpassword"}).expect(406, cb);
                    },
                    function (cb) {
                        app.post('/api/user/signup').type('json').send({"u": "", "p": "newpassword"}).expect(406, cb);
                    },
                    function (cb) {
                        app.post('/api/user/signup').type('json').send({"u": 41364591424471235, "p": "newpassword"}).expect(406, cb);
                    },
                    function (cb) {
                        app.post('/api/user/signup').type('json').send({"u": /gaeaeagga/, "p": "newpassword"}).expect(406, cb);
                    },
                    function (cb) {
                        app.post('/api/user/signup').type('json').send({"u": "        @     .    ", "p": "newpassword"}).expect(406, cb);
                    },
                    function (cb) {
                        app.post('/api/user/signup').type('json').send({"u": "fsrguhsw4itg3wgy93wgy3y83g54y93wg973gy7wy793wgy793gy@gddxndndfndfnhehe.ru", "p": "newpassword"}).expect(406, cb);
                    },
                    function (cb) {
                        app.post('/api/user/signup').type('json').send({"u": "r@T.r", "p": "newpassword"}).expect(406, cb);
                    }
                ], function (err) {
                    done(err);
                });
                it("sould return 406 when password not set", function (done) {
                    app.post('/api/user/signup').type('json').send({"u": "username@mail.com"}).expect(406, done);
                });


            });
        });

        /*describe('Signup', function () {

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
         });*/
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