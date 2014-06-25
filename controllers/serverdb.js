var async = require('async');
var models = require('../models');
var nconf = require('nconf');
var log = require('../utils/log')(module);
var UserNumber = models.UserNumber;
var GlobalNumber = models.GlobalNumber;


function update(cb) {
    async.waterfall([
            function (done) {
                var yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                UserNumber.aggregate(
                    {$match: {updatedAt: {$gte: yesterday}}},
                    {$group: {_id: null, numbers: {$addToSet: "$number"}}},
                    done
                )
            },
            function (data, done) {
                var numbers = [];
                if (data && data[0] && data[0].numbers && data[0].numbers.length)
                    numbers = data[0].numbers;
                else
                    return done(null, null);
                UserNumber.aggregate(
                    {$match: {number: {$in: numbers}}},
                    {$project: {
                        _id: 0,
                        number: 1,
                        goodness: {$cond: [
                            {$eq: [ "$category", { $literal: "black" } ]},
                            -1,
                            {$cond: [
                                {$eq: [ "$category", { $literal: "white" } ]},
                                1,
                                0
                            ]}
                        ]}
                    }},
                    {$group: {_id: "$number", goodness: {$sum: "$goodness"}}},
                    {$match: {$or: [
                        {goodness: {$gte: nconf.get("criteria:wl")}},
                        {goodness: {$lte: -nconf.get("criteria:bl")}}
                    ]}},
                    done
                );
            },
            function (data, done) {
                if (!data || !data.length)
                    return done(null, null);
                var Bulk = GlobalNumber.collection.initializeUnorderedBulkOp();
                var currentDate = new Date;
                data.forEach(function (item) {
                    Bulk.find({
                        number: item._id
                    }).upsert().updateOne({
                        $set: {
                            goodness: item.goodness,
                            updatedAt: currentDate
                        },
                        $setOnInsert: {
                            createdAt: currentDate
                        }
                    });
                });
                Bulk.execute(function (err, info) {
                    if (!info)
                        info = {};
                    info.numbers = data;
                    done(err, info);
                });
            }
        ],
        function (err, data) {
            if (err)
                log.error(err.stack);
            if (data) {
                log.info("Affected numbers:");
                if (data.numbers)
                    log.info(data.numbers);
                else
                    log.error("No numbers provided!");
                if (data.isOk())
                    log.info("Bulk update: OK!");
                else
                    log.error("Bulk update: FAIL!");
                log.info(data.toJSON());
            } else
                log.warn("No bulk result OR No changes in global lists");
            if (err)
                cb && cb(new Error("Error while process user_numbers", null));
            else
                cb && cb(null, data);
        }
    );
}


module.exports.update = update;
