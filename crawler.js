const Crawler = require("crawler");
const DB = require('./db');
var EventEmitter = require("events").EventEmitter;
var ee = new EventEmitter();

let newData = [];

module.exports = (URLs, cb) => {
    const c = new Crawler({
        // rateLimit: 1000, // `maxConnections` will be forced to 1
        maxConnections: 10,
        callback: function (error, res, done) {
            if (error) {
                console.log(error);
            } else {
                const $ = res.$;
                var data = {
                    'price': $("#priceblock_ourprice").text() || '$ -1',
                    'title': $("title").text(),
                    'asin': $('#ASIN').val(),
                    'uri': res.options.uri,
                    'when': new Date(),
                }

                // console.log(data);
                // data.img = $("#imgTagWrapperId img").attr('src');
                DB.insert(data);
                newData.push(data);
            }
            done();
        }
    });

    // Queue
    c.queue(URLs);
    c.on('drain', function () {
        //console.log('drain', newData);
        if (cb) {
            cb(newData);
        }
        // console.log('ee emit');
        ee.emit("newData", newData);
        newData = [];
    });
}


module.exports.ee = ee;