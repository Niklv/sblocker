var utils = require('./utils/utils');
var config = require('./utils/config');
var error = require('./utils/errors');
var async = require('async');

var router = {
    bind: function (app) { //bind all routes to app

        app.get("/db", function (req, res) {
            app.models.blacklist.find({}, {ph: 1, bl: 1, r: 1, _id: 0}, function (err, data) {
                if (err)
                    res.json(error(3, err));
                else
                    res.json({list: data, time: new Date().getTime()});
            });
        });

        app.post("/report", function (req, res) {
            async.auto({
                parse: function (cb) {
                    var bl = req.query.bl;
                    if (!bl)
                        cb(error(8));
                    else
                        cb(null, bl);
                },
                item: ['parse', function (cb, r) {
                    var bl = r.parse;
                    app.models.blacklist.findOne({ph: bl}, function (err, item) {
                        if (err)
                            cb(error(3, err));
                        else if (item)
                            cb(null, item);
                        else
                            new app.models.blacklist({
                                ph: bl
                            }).save(cb);
                    });
                }]
            }, function (err, r) {
                if (err) {
                    console.log(err);
                    res.json(err);
                } else {
                    console.log(r.item);
                    res.json({bl: r.item});
                }
            });
        });
    }
};

module.exports = router;