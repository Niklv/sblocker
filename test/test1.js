/*global describe, it, before, beforeEach, after, afterEach*/
/*var chai = require('chai');
chai.should();
var server = require("../server").app;
var mongoose = require('mongoose');
var db = require("../models").db;
var request = require('supertest');
var app = request(server);
var async = require("async");
chai.config.includeStack = true;


var u = "username@mail.com";
var p = "password";

describe('Initial DB routines', function () {
    before(function (done) {
        db.on('connected', done);
    });

    it('should connect to MongoDB', function (done) {
        db.readyState === 1 ? done() : done(false);
    });
});

describe('#signup', function () {
    it("add 1 user", function (done) {
        app.post('/api/user/signup').type('json').send({"u": "username@mail.c", "p": p}).expect(200, done);
    });
    it("add 2 user", function (done) {
        app.post('/api/user/signup').type('json').send({"u": "username@mail.co", "p": p}).expect(200, done);
    });
    it("add 3 user", function (done) {
        app.post('/api/user/signup').type('json').send({"u": "username@mail.com", "p": p}).expect(200, done);
    });
});
*/