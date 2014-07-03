module.exports = function (session) {
    var MongoStore = require('connect-mongo')(session);
    return new MongoStore({
        db: require('mongoose').connection.db
    });
};