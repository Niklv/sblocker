/*global describe, it, before, beforeEach, after, afterEach*/
var chai = require('chai');
chai.should();
var expect = chai.expect;
var server = require("../server").app;
var mongoose = require('mongoose');
var db = require("../models").db;
var request = require('supertest');
var app = request(server);
var async = require("async");
var crypto = require('crypto');
chai.config.includeStack = true;


var u = "username@mail.com";
var p = "password";
//GLOBALS
function clean_user(done) {
    mongoose.model('user').findOne({username: u}, function (err, user) {
        if (err) {
            return done(err);
        }
        if (user) {
            mongoose.model('token').remove({user: user._id}, function (err) {
                if (err) {
                    return done(err);
                }
                user.remove(done);
            });
        } else {
            done();
        }
    });
}


describe('Initial DB routines', function () {
    before(function (done) {
        db.on('connected', done);
    });

    it('should connect to MongoDB', function (done) {
        db.readyState === 1 ? done() : done(false);
    });
});

describe('Api', function () {
    it("should return 500 when not valid json", function (done) {
        app.post('/api').type('json').send("nojson").expect(500, done);
    });
    describe('User', function () {
        describe('#signup', function () {
            before(clean_user);
            after(clean_user);
            it("should return 200 and token when all is ok", function (done) {
                app.post('/api/user/signup').type('json').send({"u": u, "p": p}).expect(200,
                    function (err, res) {
                        res.body.should.have.property('message').be.equal('OK');
                        res.body.should.have.property('token').be.a('string');
                        done(err);
                    });
            });
            it("should return 409 and token when user already exist", function (done) {
                app.post('/api/user/signup').type('json').send({"u": u, "p": p}).expect(409,
                    function (err, res) {
                        res.body.should.have.property('err').be.equal('DuplicateError');
                        res.body.should.have.property('message').be.equal('User ' + u + ' already exist');
                        done(err);
                    });
            });
            it("should return 406 when username not set", function (done) {
                app.post('/api/user/signup').type('json').send({"p": "newpassword"}).expect(406, done);
            });
            it("should return 406 when password not set", function (done) {
                app.post('/api/user/signup').type('json').send({"u": "username@mail.com"}).expect(406, done);
            });
            it("should return 406 when username not valid", function (done) {
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
            it("should return 406 when password not valid", function (done) {
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
        describe('#login', function () {
            var token = null;
            before(function (done) {
                app.post('/api/user/signup').type('json').send({"u": u, "p": p}).expect(200,
                    function (err, res) {
                        token = res.body.token;
                        done(err);
                    });
            });
            after(clean_user);
            it("should return 406 when username not set", function (done) {
                app.post('/api/user/login').type('json').send({"p": p}).expect(406, done);
            });
            it("should return 406 when password not set", function (done) {
                app.post('/api/user/login').type('json').send({"u": u}).expect(406, done);
            });
            it("should return 406 when username not valid", function (done) {
                async.series([
                    function (cb) {
                        app.post('/api/user/login').type('json').send({"u": "            ", "p": "newpassword"}).expect(406, cb);
                    },
                    function (cb) {
                        app.post('/api/user/login').type('json').send({"u": "", "p": "newpassword"}).expect(406, cb);
                    },
                    function (cb) {
                        app.post('/api/user/login').type('json').send({"u": 41364591424471235, "p": "newpassword"}).expect(406, cb);
                    },
                    function (cb) {
                        app.post('/api/user/login').type('json').send({"u": /gaeaeagga/, "p": "newpassword"}).expect(406, cb);
                    },
                    function (cb) {
                        app.post('/api/user/login').type('json').send({"u": "        @     .    ", "p": "newpassword"}).expect(406, cb);
                    },
                    function (cb) {
                        app.post('/api/user/login').type('json').send({"u": "fsrguhsw4itg3wgy93wgy3y83g54y93wg973gy7wy793wgy793gy@gddxndndfndfnhehe.ru", "p": "newpassword"}).expect(406, cb);
                    },
                    function (cb) {
                        app.post('/api/user/login').type('json').send({"u": "r@T.r", "p": "newpassword"}).expect(406, cb);
                    }
                ], function (err) {
                    done(err);
                });
            });
            it("should return 406 when password not valid", function (done) {
                async.series([
                    function (cb) {
                        app.post('/api/user/login').type('json').send({"u": "username@mail.com", "p": ""}).expect(406, cb);
                    },
                    function (cb) {
                        app.post('/api/user/login').type('json').send({"u": "username@mail.com", "p": 16361361346431343}).expect(406, cb);
                    },
                    function (cb) {
                        app.post('/api/user/login').type('json').send({"u": "username@mail.com", "p": /newpassword/}).expect(406, cb);
                    },
                    function (cb) {
                        app.post('/api/user/login').type('json').send({"u": "username@mail.com", "p": "gszurgidgbxdrbgrbgibsdigbdigbdirgbidrbgdruibgiudgbrgibdiurgbdirgbidubgiubdribgidubrgidbrguidrb"}).expect(406, cb);
                    },
                    function (cb) {
                        app.post('/api/user/login').type('json').send({"u": "username@mail.com", "p": "new"}).expect(406, cb);
                    }
                ], function (err) {
                    done(err);
                });
            });
            it('should return 401 when wrong username', function (done) {
                app.post('/api/user/login').type('json').send({u: "wrong" + u, p: p}).expect(401, done);
            });
            it('should return 401 when wrong password', function (done) {
                app.post('/api/user/login').type('json').send({u: u, p: "wrong" + p}).expect(401, done);
            });
            it('should return 200 and new token when login', function (done) {
                var new_token, old_token = token;
                app.post('/api/user/login').type('json').send({u: u, p: p}).expect(200, function (err, res) {
                    res.body.should.have.property('token').be.a('string');
                    new_token = res.body.token;
                    new_token.should.be.not.equal(old_token);
                    mongoose.model('token').find({token: old_token}, function (err, tokens) {
                        if (err) {
                            return done(err);
                        }
                        tokens.should.be.length(0);
                        done(null);
                    });
                });
            });
        });
        describe('#logout', function () {
            var token = null;
            before(function (done) {
                app.post('/api/user/signup').type('json').send({"u": u, "p": p}).expect(200,
                    function (err, res) {
                        token = res.body.token;
                        done(err);
                    });
            });
            after(clean_user);
            it("should return 404 when username not set", function (done) {
                app.post('/api/user/logout').expect(404, done);
            });
            it("should return 404 when username zero len", function (done) {
                app.post('/api/user//logout').expect(404, done);
            });
            it("should return 404 when username space", function (done) {
                app.post('/api/user/ /logout').expect(403, done);
            });
            it("should return 403 when username not exist", function (done) {
                app.post('/api/user/' + u + "1" + '/logout').expect(403, done);
            });
            it("should return 403 when sid is not set", function (done) {
                app.post('/api/user/' + u + '/logout').type('json').send({}).expect(403, done);
            });
            it("should return 403 when sid to short", function (done) {
                app.post('/api/user/' + u + '/logout').type('json').send({sid: "a4b3195c6ced87dd165c86c8d778a4b"}).expect(403, done);
            });
            it("should return 403 when sid to long", function (done) {
                app.post('/api/user/' + u + '/logout').type('json').send({sid: "a4b3195c6ced87dd165c86c8d778a4baa"}).expect(403, done);
            });
            it("should return 403 when sid not hexademical", function (done) {
                app.post('/api/user/' + u + '/logout').type('json').send({sid: "r4b3195c6ced87dd165c86c8d778a4b1"}).expect(403, done);
            });
            it("should return 403 when fake sid", function (done) {
                app.post('/api/user/' + u + '/logout').type('json').send({sid: "a4b3195c6ced87dd165c86c8d778a4b1"}).expect(403, done);
            });
            it("should return 200 when logout is ok", function (done) {
                var sid = crypto.createHash('md5').update(u + "logout" + token).digest('hex');
                app.post('/api/user/' + u + '/logout').type('json').send({sid: sid}).expect(200, done);
            });
            it("should return 403 when try again to logout", function (done) {
                var sid = crypto.createHash('md5').update(u + "logout" + token).digest('hex');
                app.post('/api/user/' + u + '/logout').type('json').send({sid: sid}).expect(403, done);
            });
        });
        describe('+AuthScenario', function () {
            var token = null;
            after(clean_user);
            it("should return 200 when signup", function (done) {
                app.post('/api/user/signup').type('json').send({"u": u, "p": p}).expect(200,
                    function (err, res) {
                        token = res.body.token;
                        done(err);
                    });
            });
            it("should return 200 when logout", function (done) {
                var sid = crypto.createHash('md5').update(u + "logout" + token).digest('hex');
                app.post('/api/user/' + u + '/logout').type('json').send({sid: sid}).expect(200, done);
            });
            it("should return 200 when login", function (done) {
                app.post('/api/user/login').type('json').send({u: u, p: p}).expect(200, function (err, res) {
                    token = res.body.token;
                    done(err);
                });
            });
            it("should return 200 when logout", function (done) {
                var sid = crypto.createHash('md5').update(u + "logout" + token).digest('hex');
                app.post('/api/user/' + u + '/logout').type('json').send({sid: sid}).expect(200, done);
            });
            it("should return 200 when login", function (done) {
                app.post('/api/user/login').type('json').send({u: u, p: p}).expect(200, function (err, res) {
                    token = res.body.token;
                    done(err);
                });
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