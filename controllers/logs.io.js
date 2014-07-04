var EventEmitter = require('events').EventEmitter;
var passportSocketIo = require("passport.socketio");
var cookieParser = require('cookie-parser');
var SessionStore = require("./session_store");
var nconf = require("nconf");
var emitter = new EventEmitter;

function create(app) {
    var io = require('socket.io')(app);
    io.use(passportSocketIo.authorize({
        cookieParser: cookieParser,
        key: nconf.get("cookie_name"),
        secret: nconf.get("session:secret"),
        store: new SessionStore(),
        success: onAuthorizeSuccess,
        fail: onAuthorizeFail
    }));

    emitter.on('logging', function (msg) {
        msg = msg.replace(/\x1B\[([0-9]{1,2}(;[0-9]{1,2})?)?[m|K]/g, '')
        io.emit('log', msg);
    });
    return io;
}


function onAuthorizeSuccess(data, accept) {
    console.log('successful connection to socket.io');
    accept(null, true);
}

function onAuthorizeFail(data, message, error, accept) {
    if (error) {
        console.error(error);
        console.error(message);
        //throw new Error(message);
    }
    console.log('failed connection to socket.io:', message);
    accept(null, false);
}


module.exports.emitter = emitter;
module.exports.create = create;