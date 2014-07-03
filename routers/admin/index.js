var express = require("express");
var _ = require("underscore");
var async = require("async");
var nconf = require("nconf");
var flash = require("connect-flash");
var models = require("../../models");
var cookieParser = require('cookie-parser');
var session = require("express-session");
var passport = require("passport");
var android = require('../../controllers/push_notification/android');
var log = require('../../controllers/log')(module);

var router = express.Router();

require('../../controllers/passport')(passport);
router.use(cookieParser());
router.use(session({
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
));
router.use(passport.initialize());
router.use(passport.session());
router.use(flash());

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated())
        next();
    else
        res.redirect('/admin/login');
}


router.get('/login', function (req, res) {
    if (req.isAuthenticated())
        res.redirect('.');
    else
        res.render('admin/login');
});


router.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, admin, info) {
        if (err)
            return next(err);
        if (!admin)
            return res.render('admin/login', info);
        req.logIn(admin, function (err) {
            if (err)
                return next(err);
            if (req.body.remember) {
                req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
                req.session.cookie.expires = false;
            }
            return res.redirect('.');
        });
    })(req, res, next);
});


router.use(ensureAuthenticated);

router.get('/', function (req, res) {
    res.render('admin/index');
});

router.get('/android_push', function (req, res) {
    models.User.find({androidRegistrationId: {$exists: true}}, function (err, data) {
        if (err)
            return next(err);
        else
            res.render('admin/android_push', {users: data});
    });

});

router.get('/logout', ensureAuthenticated, function (req, res) {
    req.session.destroy(function (err) {
        if (err)
            log.error(err.stack);
        req.logout();
        res.redirect('login');
    });
});

router.use('/', function (err, req, res, next) {
    res.render('admin/error', {err: err});
});


router.post('/api/push', function (req, res, next) {
    if (!req.body || !req.body._id)
        return res.json(400, {err: "No _id"});
    models.User.findById(req.body._id, function (err, user) {
        if (err)
            return res.json(400, {err: err.stack});
        if (req.body.type == "android") {
            var message = {
                collapse_key: "android_test_message",
                delay_while_idle: true,
                time_to_live: nconf.get('gcm:pushTTL'),
                data: {
                    message: "Android test message"
                },
                dry_run: false
            };
            android.push(message, [user.androidRegistrationId], function (err, data) {
                if (err)
                    return res.json(400, {err: err.stack});
                log.info(data);
                res.json(200, {status: "Ok!", data: data});

            });
        } else
            return res.json(400, {err: "Unknown type"});
    });
});

router.post('/api/custom_push', function (req, res, next) {
    var msg = {};
    if (_.has(req.body, "registration_ids") && _.isArray(req.body.registration_ids))
        msg.registration_ids = req.body.registration_ids;
    else
        return res.json(200, {err: {
            msg: "No registration_ids"
        }});
    if (!_.has(req.body, "dry_run"))
        msg.dry_run = (req.body.dry_run === "true");
    if (!_.has(req.body, "delay_while_idle"))
        msg.delay_while_idle = (req.body.delay_while_idle === "true");
    if (!_.has(req.body, "time_to_live")) {
        msg.time_to_live = parseInt(req.body.time_to_live);
        if (_.isNaN(msg.time_to_live) || _.isNull(msg.time_to_live) || _.isUndefined(msg.time_to_live))
            delete msg.time_to_live;
    }
    android.push(msg, null, function (err, data) {
        if (err)
            return res.json(200, {err: {msg: err.message}});
        log.info(data);
        res.json(200, {status: "Ok!", data: data});
    });
});



module.exports.router = router;