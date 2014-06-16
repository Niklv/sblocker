var _ = require('underscore');
var async = require('async');
var models = require('../models');
var config = require('../config');
var log = require('../utils/log')(module);
var UserList = models.UserList;
var Blacklist = models.Blacklist;
var Whitelist = models.Whitelist;


function update(cb) {
    async.waterfall([
            function (done) {
                var yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                UserList.aggregate(
                    {$match: {updatedAt: {$gte: yesterday}}},
                    {$group: {_id: null, phones: {$addToSet: "$phone"}}},
                    done
                )
            },
            function (data, done) {
                var phones = [];
                if (data && data[0] && data[0].phones && data[0].phones.length)
                    phones = data[0].phones;
                else
                    return done();
                UserList.aggregate(
                    {$match: {phone: {$in: phones}}},
                    {$project: {
                        _id: 0,
                        phone: 1,
                        val: {
                            $cond: {
                                if: {$eq: [ "$category", { $literal: "black" } ]},
                                then: -1,
                                else: {
                                    $cond: {
                                        if: {$eq: [ "$category", { $literal: "white" } ]},
                                        then: 1,
                                        else: 0
                                    }
                                }
                            }
                        }
                    }},
                    {$group: {_id: "$phone", val: {$sum: "$val"}}},
                    {$match: {$or: [
                        {val: {$gte: config.criteria.wl}},
                        {val: {$lte: -config.criteria.bl}}
                    ]}},
                    done
                );
            },
            function (data, done) {
                if (!data || !data.length)
                    return done(null);
                var BulkBl = Blacklist.collection.initializeUnorderedBulkOp();
                var BulkWl = Whitelist.collection.initializeUnorderedBulkOp();
                data.forEach(function (item) {
                    if (item.val > 0) {
                        BulkWl.find({number: item._id}).upsert().updateOne({$setOnInsert: {createdAt: new Date}});
                        BulkBl.find({number: item._id}).removeOne();
                    } else {
                        BulkBl.find({number: item._id}).upsert().updateOne({$setOnInsert: {createdAt: new Date}});
                        BulkWl.find({number: item._id}).removeOne();
                    }
                });
                async.parallel({
                    wl: function (done) {
                        BulkWl.execute(done);
                    },
                    bl: function (done) {
                        BulkBl.execute(done);
                    }
                }, function (err, info) {
                    if (!info)
                        info = {};
                    info.numbers = data;
                    done(err, info);
                });
            }
        ],
        function (err, data) {
            if (err){
                log.error(err.stack);
                return cb && cb(new Error("Error while process user_lists"));
            }
            if (data) {
                log.info("Affected numbers:");
                if (data.numbers)
                    log.info(data.numbers);
                else
                    log.error("No numbers provided!");
                if (data.wl) {
                    if (data.wl.isOk())
                        log.info("Whitelist bulk update: OK!");
                    else
                        log.error("Whitelist bulk update: FAIL!");
                    log.info(data.wl.toJSON());
                } else
                    log.error("No Whitelist bulk info!");
                if (data.bl) {
                    if (data.bl.isOk())
                        log.info("Blacklist bulk update: OK!");
                    else
                        log.error("Blacklist bulk update: FAIL!");
                    log.info(data.bl.toJSON());
                } else
                    log.error("No Blacklist bulk info!");
            } else
                log.info("Now changes in global lists");
            return cb && cb(null);
        }
    );
}


module.exports.update = update;
