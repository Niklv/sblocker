var utils = require('./utils');
var config = require('./config');

var router = {
    bind: function (app) { //bind all routes to app
        app.get("/code", function (req, res) {
            //verify phone
            var parse_result = utils.phone(req.query.ph);
            if (parse_result.err) {
                res.json(parse_result);
            } else {
                var phone = parse_result.str;
                //generate code
                var size = config.code_size;
                var code = ("" + Math.random()).substring(2, 2 + size);
                //send code
                console.log(phone, code);
                res.json({code: code});
            }
        });
        app.post("/code", function (req, res) {
            //verify params
            //req.query.ph.match(/[0-9]+/g);
        });

        app.get("/db", function (req, res) {

        });

        app.post("/db", function (req, res) {

        });
    }
};

module.exports = router;