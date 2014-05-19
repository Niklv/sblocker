var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var number = require('./number');

var blacklist = new Schema(number);

module.exports = mongoose.model('blacklist', blacklist);
