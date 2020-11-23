var jwt = require('jsonwebtoken');

exports.signJWT = async(data) => {
    return new Promise((resolve, reject) => {
        try {
            let token = jwt.sign(data, process.env.PRIVATE_JWT_KEY);
            return resolve(token);
        } catch (err) {
            console.log(err);
            return reject(err);
        }
    });
};

exports.decode = async(token) => {
    return new Promise((resolve, reject) => {
        try {
            let decoded = jwt.verify(token, process.env.PRIVATE_JWT_KEY);
            console.log(decoded)
            return resolve(decoded);
        } catch (err) {
            return reject(err);
        }
    });
};