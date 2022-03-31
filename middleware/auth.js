const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    let token = req.headers.authorization;

    if (!token) {
        return res.status(403).send({status: 403, message: "Please provide auth token"});
    }
    token = token.split(" ")[1]
    try {
        req.deviceId = jwt.verify(token, process.env.TOKEN_SECRET).user_id.deviceId;
        console.log(req.deviceId);
    } catch (err) {
        return res.status(401).send({status: 401, message: "Unauthorized"});
    }
    return next();
};

exports.verifyToken = verifyToken;