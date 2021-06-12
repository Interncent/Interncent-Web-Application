// require('dotenv').load();
const jwt = require('jsonwebtoken');
const db = require('../models');
exports.loginRequired = function (req, res, next) {
    try {
        let token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
            if (err) {
                return next(err)
            }
            if (decoded) {
                return next();
            } else {
                return next({
                    status: 401,
                    message: 'Please Log in first'
                })
            }
        })
    } catch (err) {
        next({
            status: 401,
            message: 'Please Log in first'
        });
    }
}

exports.ensureCorrectUser = function (req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
            if (decoded && (decoded._id === req.params.secureId)) {
                if (decoded.emailToken === null) {
                    return next();
                } else {
                    return next({
                        status: 401,
                        message: 'Please verify your email first or try to Signup Again'
                    })
                }
            } else {
                return next({
                    status: 401,
                    message: 'Unauthorized'
                })
            }
        })
    } catch (err) {
        next({
            status: 401,
            message: 'Unauthorized'
        });
    }
}


