const DB = require('./db');

module.exports = function (server, ee) {
    var io = require('socket.io')(server);

    io.on('connection', function (client) {
        // console.log('Client connected...');

        client.on('past', function () {
            DB.find((err, data) => {
                client.emit('data', err || data);
            });
        });

        // console.log('ee on');
        ee.on('newData', (data) => {
            // console.log('ee newdata');
            client.emit('data', data);
        });
    });

    return server;
}