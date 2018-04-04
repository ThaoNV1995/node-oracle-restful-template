const users = require('../db_apis/user');
const config = require("../config/sercurity.js");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


function post(req, res, next) {
    const user = {
        email: req.body.email.toLowerCase()
    }
    var unhashedPassword = req.body.password;
    bcrypt.genSalt(10, function (err, salt) {
        if (err) {
            return next(err);
        }
        bcrypt.hash(unhashedPassword, salt, (err, hash) => {
            if (err) {
                return next(err);
            }

            user.hashedPassword = hash;

            users.create(user)
                .then(user => {
                    let payload;
                    console.log(user);
                    payload = {
                        sub: user.email,
                        role: user.role
                    }

                    res.status(200).json({
                        user: user,
                        token: jwt.sign(payload, config.jwtSecretKey, { expiresIn: 604800 })
                    });

                })
                .catch(next);
        })
    })

}

module.exports.post = post;