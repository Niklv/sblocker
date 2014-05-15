var util = require("util");
var http = require("http");
var log = require("./log")(module);

/*function HttpError(status, message) {
 this.status = status;
 this.message = message || http.STATUS_CODES[status];
 Error.captureStackTrace(this, HttpError);
 }
 util.inherits(HttpError, Error);
 HttpError.prototype.name = "HttpError";
 */


function PageNotFound(req, res, next) {
    next(404);
}

function ErrorHandler(err, req, res, next) {
    if (typeof err === 'number')
        return res.json(err, {err: {num: "" + err, msg: "HTTP" + err + " error"}});

    res.json(500, {err: {num: "500", msg: "Unknown error"}})
}

module.exports.handler = ErrorHandler;
module.exports.PageNotFound = PageNotFound;
