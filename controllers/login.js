const login = require('../db_apis/login.js');
const config = require("../config/sercurity.js");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


function post(req, res, next){
    const user = {
        email: req.body.email.toLowerCase()
    }

    login.login(user)
        .then(user => {
            console.log(user);
            const us = user[0];
        
            const password = req.body.password;
            bcrypt.compare(password, us.password, (err, pwMatch)=>{
                let payload;
                if(err){
                    return next(err);
                }

                if(!pwMatch){
                    res.status(401).send({message:'Invalid email or password'});
                    return;
                }

                payload ={
                    sub: us.email,
                    role: us.role
                }

                var result = {
                    user: us,
                    token: jwt.sign(payload, config.jwtSecretKey , {expiresIn: 604800})
                }

                res.status(200).json(result);
            });
        })
        .catch(next);

}

module.exports.post = post;