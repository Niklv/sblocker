var util = require("util");
var http = require("http");
var log = require("./log")(module);


function UsernameFormatError(message) {
    this.message = message;
    Error.captureStackTrace(this, UsernameFormatError);
}
util.inherits(UsernameFormatError, Error);
UsernameFormatError.prototype.name = "UsernameFormatError";


function PasswordFormatError(message) {
    this.message = message;
    Error.captureStackTrace(this, PasswordFormatError);
}
util.inherits(PasswordFormatError, Error);
PasswordFormatError.prototype.name = "PasswordFormatError";


function HttpError(status, message) {
    this.status = status;
    this.message = message || http.STATUS_CODES[status];
    Error.captureStackTrace(this, HttpError);
}
util.inherits(HttpError, Error);
HttpError.prototype.name = "HttpError";


function DatabaseError(message) {
    this.message = message;
    Error.captureStackTrace(this, DatabaseError);
}
util.inherits(DatabaseError, Error);
DatabaseError.prototype.name = "DatabaseError";


function DuplicateError(message) {
    this.message = message;
    Error.captureStackTrace(this, DuplicateError);
}
util.inherits(DuplicateError, Error);
DuplicateError.prototype.name = "DuplicateError";

function PageNotFound(req, res, next) {
    next(new HttpError(404));
}

function ErrorHandler(err, req, res, next) {
    if (typeof err === 'number')
        err = new HttpError(err);

    switch (err.name) {
        case "UsernameFormatError":
            res.json(406, {err: "UsernameFormatError"});
            break;
        case "PasswordFormatError":
            res.json(406, {err: "PasswordFormatError"});
            break;
        case "DatabaseError":
            res.send(500);
            break;
        case "HttpError":
            res.send(404);
            break;
        case "DuplicateError":
            res.send(406, {err: "DuplicateError", message: err.message});
            break;
        case "SyntaxError":
            res.send(406, {err: "Syntax error"});
            break;
        default:
            res.send(500);
            break;
    }
    log.error(err.stack);
}

module.exports.UsernameFormatError = UsernameFormatError;
module.exports.PasswordFormatError = PasswordFormatError;
module.exports.HttpError = HttpError;
module.exports.DatabaseError = DatabaseError;
module.exports.DuplicateError = DuplicateError;
module.exports.handler = ErrorHandler;
module.exports.PageNotFound = PageNotFound;