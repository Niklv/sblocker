var EventEmitter = require('events').EventEmitter;
var passportSocketIo = require("passport.socketio");
var cookieParser = require('cookie-parser');
var sessionStore = require("./sessionStore");
var nconf = require("nconf");
var emitter = new EventEmitter;

function create(app) {
    var io = require('socket.io')(app);
    /*io.use(passportSocketIo.authorize({
        cookieParser: cookieParser,
        key: nconf.get("cookie_name"),
        secret: nconf.get("session:secret"),
        store: sessionStore(require('express-session')),
        success: onAuthorizeSuccess,
        fail: onAuthorizeFail
    }));*/
    /*
     session({
     name: "sblkr.auth",
     secret: nconf.get("session:secret"),
     store: require('../../controllers/session')(session),
     cookie: {
     path: '/admin',
     httpOnly: true,
     secure: true,
     maxAge: 1000 //30days nconf.get("session:maxage")
     },
     resave: true,
     saveUninitialized: false,
     unset: "destroy"
     }
     )*/


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
    if (error)
        throw new Error(message);
    console.log('failed connection to socket.io:', message);
    //console.log(data);
    accept(null, false);
}


module.exports.emitter = emitter;
module.exports.create = create;