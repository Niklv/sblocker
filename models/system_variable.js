var nconf = require('nconf');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var system_variable = new Schema({
    name: {
        type: String,
        require: true,
        index: {unique: true}
    },
    value: Schema.Types.Mixed
});

system_variable.statics.getClientDbVersion = function (cb) {
    return this.findOne({ name: nconf.get("sys_vars:client_db_version:name") }, {_id: 0, value: 1},
        function (err, variable) {
            if (err)
                return cb(err, null);
            if (variable && (typeof variable.value != 'undefined'))
                return cb(err, variable.value);
            else
                return cb(new Error("Variable or value not exist"), null);
        }
    );
};

system_variable.statics.incClientDbVersion = function (cb) {
    return this.findOneAndUpdate({ name: nconf.get("sys_vars:client_db_version:name") }, { $inc: { value: 1 }}, function (err, data) {
        cb(err, data ? data.value : null);
    });
};

module.exports = mongoose.model('system_variable', system_variable);

