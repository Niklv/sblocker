var util = require("util");
var http = require("http");
var log = require("./log")(module);

function ServerError(message, error_code, http_code) {
    this.http_code = typeof http_code !== 'undefined' ? http_code : 500;
    this.error_code = "" + typeof error_code !== 'undefined' ? error_code : 0;
    this.message = typeof message !== 'undefined' ? message : "Unknown error";
    Error.captureStackTrace(this, ServerError);
}
util.inherits(ServerError, Error);
ServerError.prototype.name = "serverError";
ServerError.prototype.getJsonMessage = function () {
    return {
        err: {
            num: this.error_code,
            msg: this.message
        }
    };
};


function PageNotFound(req, res, next) {
    next(new ServerError("Page not found", 404, 404));
}

function ErrorHandler(err, req, res, next) {
    if (typeof err === 'number')
        return res.json(err, {err: {num: "" + err, msg: "HTTP" + err + " error"}});
    if (err && err.name == "serverError")
        return res.json(err.http_code, err.getJsonMessage());
    res.json(500, {err: {num: "500", msg: "Unknown error"}})
}

module.exports.handler = ErrorHandler;
module.exports.PageNotFound = PageNotFound;
module.exports.ServerError = ServerError;
