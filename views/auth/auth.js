const jwt = require('./jwt');

//auth middleware
exports.authenticateJWT = async (req, res, next) => {
    try {
        var date = await Date.now();
        if (req.headers.token !== undefined && req.headers.token !== 'undefined') {
            var token = req.headers.token;
            var decoded = await jwt.decode(token);
            if (decoded.uid === undefined || decoded.uid === '')
            {throw { status: 401, message: 'Request unauthenticated' };}
            console.log(decoded.uid)
                req.userId = decoded.uid;
                req.role = decoded.t;
                next();
        } else
        {throw { status: 401, message: 'Request unauthenticated' };}
    } catch (err) {
        next(err);
    }
};