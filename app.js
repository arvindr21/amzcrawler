const path = require('path');
const express = require('express');

var app = express();
var server = require('http').createServer(app);

app.use(express.static(__dirname + '/node_modules'));

const port = process.env.PORT || 3000;
const DB = require('./db');

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0; // hack for CRAWLER Error Error: self signed certificate

const URLs = [
    'https://www.amazon.com/Samsung-Chromebook-Wi-Fi-11-6-Inch-Refurbished/dp/B00M9K7L8S',
    'https://www.amazon.com/Movado-0606759-Pilot-Stainless-Steel/dp/B00D89VK3Q',
    'https://www.amazon.com/HERSHEYS-Chocolate-Candy-Extra-Exclusive/dp/B07TX474NT'
];

const crawl = require('./crawler');

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/crawl', function (req, res) {
    const url = req.body.url;
    crawl([url], (data) => {
        res.status(200).send(data);
    });
});

crawl(URLs);
// Init crawler
setInterval(function () {
    // console.log('crawler called');
    crawl(URLs);
}, 300000);

server = require('./socket')(server, crawl.ee);

server.listen(port)
console.log('Crawler Running on port', port);
exports = module.exports = app;

