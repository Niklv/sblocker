var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var number = require('./number');

var transitional_blacklist = new Schema(number);

module.exports = mongoose.model('transitional_blacklist', transitional_blacklist);

