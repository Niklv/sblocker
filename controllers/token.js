var jwt = require('jwt-simple');
var request = require('request');
var config = require('../config');
var log = require('../utils/log')(module);

var googleCerificates = {
    first: null,
    second: null
};

function updateCertificates() {
    log.info("Start updating google certificates");
    request({
        url: config.token.google_cert,
        json: true
    }, function (err, res, body) {
        if (!err && res.statusCode == 200) {
            var certs = [];
            if (typeof body == 'object') {
                for (var key in body)
                    certs.push(body[key]);
                if (certs.length != 2) {
                    log.error("More or less than two google certs!");
                    log.error(certs);
                } else {
                    googleCerificates.first = certs[0];
                    googleCerificates.second = certs[1];
                    log.info("Google certs successfully updated");
                }
            } else {
                log.error("Body not in json format");
                log.error("Body content:");
                log.error(body);
            }
        } else {
            log.error("Error while updating Google certs:");
            log.error("Error:");
            log.error(err.message);
            log.error(err);
            if (res)
                log.error("Http code: " + res.statusCode);
            log.error("Body:");
            log.error(body);
        }
    });

}

function decodeToken(token) {
    if (!token || !googleCerificates || !googleCerificates.first || !googleCerificates.second)
        return null;
    var decodedToken = null;
    try {
        decodedToken = jwt.decode(token, googleCerificates.first);
    } catch (err) {
        decodedToken = null;
    }
    try {
        decodedToken = jwt.decode(token, googleCerificates.second);
    } catch (err) {
        decodedToken = null;
    }
    return decodedToken;
}

function verifyToken(token) {
    return ((token)
        //&& (token.azp == config.token.azp)
        //&& (token.aud == config.token.aud)
        //&& (token.email_verified)
        //&& (token.exp > (new Date()).getTime() / 1000)
        );
}


module.exports.updateCertificates = updateCertificates;
module.exports.decodeToken = decodeToken;
module.exports.verifyToken = verifyToken;