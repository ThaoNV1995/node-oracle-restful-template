var jwt = require("jsonwebtoken");
var config = require("../config/sercurity.js");

function authenticate(role){
    return function(req, res, next){
        var token;
        var payload;

        if(!req.headers.authorization){
            return res.status(401).send({message:'you are not authorization (Bạn éo có quyền truy cập lêu lêu)'})
        }

        token = req.headers.authorization.split(' ')[1];

        try {
            payload = jwt.verify(token, config.jwtSecretKey);
        } catch (e) {
            if (e.name === 'TokenExpiredError') {
                res.status(401).send({message: 'Token Expired (Xác thực đã hết hạn)'});
            } else {
                res.status(401).send({message: 'Authentication failed (Xác thực éo đúng lêu lêu)'});
            }
            return;
        }

        if(!role || role === payload.role){
            req.user = {
                email: payload.sub,
                role: payload.role
            };
            next();
        } else{
            res.status(401).send({message: 'You are not authorized (Bạn éo có quyền truy cập lêu lêu)'});
        }
    }
}

module.exports.authenticate = authenticate;