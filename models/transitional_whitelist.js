var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var number = require('./number');

var transitional_whitelist = new Schema(number);

module.exports = mongoose.model('transitional_whitelist', transitional_whitelist);