var _ = require('underscore');
var async = require('async');
var models = require('../models');
var log = require('../utils/log')(module);
var UserList = models.UserList;

var opts = {};
opts.map = function () {
    if (this.category == "black")
        emit(this.phone, -1);
    else if (this.category == "white")
        emit(this.phone, 1);
    else
        emit(this.phone, 0);
};

opts.reduce = function (key, values) {
    /*console.log(key, values);
     var sum = 0;
     values.forEach(function (value) {
     sum += value;
     });*/
    //return {sum: sum, count: values.length};
    return values.length;
};
opts.verbose = true;


function update() {
    async.waterfall([
            function (done) {
                //UserList.mapReduce(opts, done);
                var yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 10);
                UserList.aggregate(
                    {$match: {updatedAt: {$gte: yesterday}}},
                    {$project: {_id: 0, phone: 1}},
                    {$match: {phone: "$phone"}},
                    done
                )
            }/*,
             function (data, done) {
             data = _.pluck(data, "_id");
             console.log(data);
             UserList.aggregate(
             {$match: {phone: {$in: data}}},
             //{$project: {_id: 0, phone: 1}},
             //{$group: {_id: "$phone"}},
             done
             );
             //log.info('map reduce took %d ms', stats.processtime);
             //log.info(stats);
             //data.forEach(function(item){
             //if(item.)
             //});
             }*/
        ],
        function (err, data) {
            if (err)
                log.error(err);
            console.log(data);
        }
    )
    ;
}


module.exports.update = update;
