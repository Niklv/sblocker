var _ = require('underscore');
var user = require('./user');
var blacklist = require('./blacklist');


module.exports = _.extend({}, user, blacklist);
