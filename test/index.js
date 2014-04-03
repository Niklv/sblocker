/*global describe, it, before, beforeEach, after, afterEach*/
var chai = require('chai');
chai.should();
var expect = chai.expect;
var server = require("../server").app;
var models = require("../models").models;
var db = require("../models").db;
//app.listen(3000, function(){});
var request = require('supertest');
var app = request(server);
var async = require("async");

chai.config.includeStack = true;

describe('Initial DB routines', function () {
    before(function (done) {
        db.on('connected', done);
    });

    it('Should connect to MongoDB', function (done) {
        db.readyState === 1 ? done() : done(false);
    });
});

describe('Api', function () {
    it("sould return 500 when not valid json", function (done) {
        app.post('/api').type('json').send("nojson").expect(500, done);
    });
    describe('User', function () {
        describe('#signup', function () {
            describe('bad_data', function () {
                it("sould return 406 when username not set", function (done) {
                    app.post('/api/user/signup').type('json').send({"p": "newpassword"}).expect(406, done);
                });
                it("sould return 406 when password not set", function (done) {
                    app.post('/api/user/signup').type('json').send({"u": "username@mail.com"}).expect(406, done);
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
                });
                it("sould return 406 when passowrd not valid", function (done) {
                    async.series([
                        function (cb) {
                            app.post('/api/user/signup').type('json').send({"u": "username@mail.com", "p": ""}).expect(406, cb);
                        },
                        function (cb) {
                            app.post('/api/user/signup').type('json').send({"u": "username@mail.com", "p": 16361361346431343}).expect(406, cb);
                        },
                        function (cb) {
                            app.post('/api/user/signup').type('json').send({"u": "username@mail.com", "p": /newpassword/}).expect(406, cb);
                        },
                        function (cb) {
                            app.post('/api/user/signup').type('json').send({"u": "username@mail.com", "p": "gszurgidgbxdrbgrbgibsdigbdigbdirgbidrbgdruibgiudgbrgibdiurgbdirgbidubgiubdribgidubrgidbrguidrb"}).expect(406, cb);
                        },
                        function (cb) {
                            app.post('/api/user/signup').type('json').send({"u": "username@mail.com", "p": "new"}).expect(406, cb);
                        }
                    ], function (err) {
                        done(err);
                    });
                });
            });
            describe('good_data', function () {
                it("sould return 200 and token when all is ok", function (done) {
                    app.post('/api/user/signup').type('json').send({"u": "username@mail.com", "p": "password"}).expect(200,
                        function (err, res) {
                            res.body.should.have.property('message').be.equal('OK');
                            res.body.should.have.property('token').be.a('string');
                            done(err);
                        });
                });
                it("sould return 200 and token when user already exist", function (done) {
                    app.post('/api/user/signup').type('json').send({"u": "username@mail.com", "p": "password"}).expect(406,
                        function (err, res) {
                            res.body.should.have.property('err').be.equal('DuplicateError');
                            res.body.should.have.property('message').be.equal('User username@mail.com already exist');
                            done(err);
                        });
                });
                after(function (done) {
                    models.user.findOne({username: "username@mail.com"}, function (err, user) {
                        if (err) {
                            return done(err);
                        }
                        if (user) {
                            user.remove(done);
                        }
                    });
                });
            });
        });
        describe('#login', function () {
            var token = null;
            before(function (done) {
                app.post('/api/user/signup').type('json').send({"u": "username@mail.com", "p": "password"}).expect(200,
                    function (err, res) {
                        token = res.body.token;
                        done(err);
                    });
            });
            describe('bad_data', function () {
            });
            describe('good_data', function () {
            });

            it('should return HTTP404 when wrong page', function (done) {
                app.get('/404').expect(404, done);
            });
        });
    });

    it('should return HTTP404 when wrong page', function (done) {
        app.get('/404').expect(404, done);
    });
});


describe('Db', function () {
    before(function (done) {
        require('mongoose').disconnect(function () {
            done();
        });
    });
    it('Should disconnected from MongoDB', function (done) {
        db.readyState === 1 ? done(false) : done();
    });
    it('should return HTTP500 when DB not work', function (done) {
        app.get('/api').expect(500, done);
    });
});