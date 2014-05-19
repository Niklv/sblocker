var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var number = require('./number');

var whitelist = new Schema(number);

module.exports = mongoose.model('whitelist', whitelist);

