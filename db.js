const mongojs = require('mongojs')
const db = mongojs(process.env.MONGODB_URI, ['records']);

db.on('error', function (err) {
    console.log('database error', err)
});

db.on('connect', function () {
    console.log('database connected')
});

module.exports.insert = function (doc) {
    db.records.insert(doc);
}

module.exports.find = function (cb) {
    db.records.find({}).limit(501).toArray(cb);
}