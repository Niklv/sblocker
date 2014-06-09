var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var transitional_number = require('./transitional_number');

var transitional_blacklist = new Schema(transitional_number);

module.exports = mongoose.model('transitional_blacklist', transitional_blacklist);

