var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mail_template = new Schema({
    name: {
        type: String,
        require: true,
        index: {unique: true}
    },
    template: {
        type: Object,
        require: true
    }
});

module.exports = {mail: mongoose.model('mail_template', mail_template)};
