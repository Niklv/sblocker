var express = require("express");
var util = require("util");


function UsernameError(message) {
    this.message = message;
    Error.captureStackTrace(this, UsernameError);
}
util.inherits(UsernameError, Error);
UsernameError.prototype.name = "UsernameError";

function PasswordError(message) {
    this.message = message;
    Error.captureStackTrace(this, PasswordError);
}
util.inherits(PasswordError, Error);
PasswordError.prototype.name = "PasswordError";

function HttpError(status, message) {
    this.status = status;
    this.message = message;
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


ErrorRouter = express.Router();

ErrorRouter.use(function (err, req, res, next) {

});


module.exports.UsernameError = UsernameError;
module.exports.PasswordError = PasswordError;
module.exports.HttpError = HttpError;
module.exports.DatabaseError = DatabaseError;
module.exports.router = ErrorRouter;