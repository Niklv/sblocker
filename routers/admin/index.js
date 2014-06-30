var express = require("express");
var _ = require("underscore");
var async = require("async");
var nconf = require("nconf");
var flash = require("connect-flash");
var ServerError = require("../../utils/error").ServerError;
var session = require("express-session");
var passport = require("passport");
var log = require('../../utils/log')(module);

var router = express.Router();

require('../../controllers/passport')(passport);
router.use(session({ secret: nconf.get("session_secret"), resave: true, saveUninitialized: true }));
router.use(passport.initialize());
router.use(passport.session());
router.use(flash());

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated())
        next();
    else
        res.redirect('login');
}


router.get('/login', function (req, res) {
    if (req.isAuthenticated())
        res.redirect('.');
    else
        res.render('admin/login');
});


router.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, admin, info) {
        console.log(arguments);
        if (err)
            return next(err);
        if (!admin)
            return res.render('admin/login', info);
        req.logIn(admin, function (err) {
            if (err)
                return next(err);
            return res.redirect('.');
        });
    })(req, res, next);
});


router.use(ensureAuthenticated);

router.get('/', function (req, res) {
    res.render('admin/index');
});

router.get('/push', function (req, res) {
    res.render('admin/push');
});

router.get('/logout', ensureAuthenticated, function (req, res) {
    req.logout();
    res.redirect('login');
});

module.exports.router = router;

