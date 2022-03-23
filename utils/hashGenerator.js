const bcrypt = require('bcrypt');
const saltRounds = 10;

const generateHash = function (password, cb) {
    bcrypt.hash(password, saltRounds, function(err, hash) {
        cb(hash);
    });
}

const compareHash = function (password, hash, cb) {
    bcrypt.compare(password, hash, function(err, result) {
        return cb(result);
    });
}

exports.generateHash = generateHash;
exports.compareHash = compareHash;
