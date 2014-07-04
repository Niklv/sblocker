var nconf = require("nconf");
var util = require("util");
var session = require("express-session");
var MongoStore = require('connect-mongo')(session);


function SessionStore() {
    SessionStore.super_.call(this, {
        mongoose_connection: require('mongoose').connection
    });
    this.className = "SessionStore";
}

util.inherits(SessionStore, MongoStore);

module.exports = SessionStore;