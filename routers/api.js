var express = require("express");

var api = express.Router();


function verifyToken(token) {

}


api.use('', function (req, res, next) {
    if(req.body)
        log.info(req.body);
    //TODO: JSON WEB TOKEN VALIDATION
    //TODO: FIND USER
    //TODO: IF NEW THEN ADD TO DB NEW USER
    //TODO: REQ.USER
    next();
});

api.get('/phone_db', function (req, res) {
    //TODO: GET PHONES DB
    res.json(200, {status: 'In progress'});
});

api.post('change_phone', function (req, res) {
    //TODO: POST NEW PHONES TO DB
    res.json(200, {status: 'In progress'});
});

module.exports.router = api;
