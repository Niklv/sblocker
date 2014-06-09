var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var transitional_number = require('./transitional_number');

var transitional_whitelist = new Schema(transitional_number);

module.exports = mongoose.model('transitional_whitelist', transitional_whitelist);