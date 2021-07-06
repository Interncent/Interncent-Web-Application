const express = require('express');
const router = express.Router();
const { signup, signin } = require('../handlers/auth');
const db = require('../models');
const jwt = require('jsonwebtoken');
const mailer = require('../handlers/mailer')
const crypto = require('crypto')

router.post('/signup', signup);

router.post('/signin', signin);

router.get('/verify-email/:token', async (req, res, next) => {
    db.User.findOne({ emailToken: req.params.token }, '-password')
        .then(async (user) => {
            user.emailToken = null;
            await user.save();
            let token = jwt.sign({
                ...user._doc
            }, process.env.SECRET_KEY);
            return res.status(200).send({ ...user._doc, token });
        }).catch((err) => {
            next(err);
        });
});

router.put('/passwordReset/verification', (req, res, next) => {
    db.User.findOne({ email: req.body.email })
        .then(async (user) => {
            if (!user) {
                return next({
                    status: 404,
                    message: "User Not Found"
                })
            }
            if (user.emailToken !== null) {
                return next({
                    status: 402,
                    message: "Please verify your account before changing the password."
                })
            }
            try {
                const passwordResetToken = crypto.randomBytes(64).toString('hex');
                user.passwordResetToken = passwordResetToken
                await user.save()
                const mailBody = {
                    to: [req.body.email],
                    subject: "Password Reset",
                    text: `Please click on the Link below to verify your email.<br>${process.env.PROXY_URL}/password-reset/${passwordResetToken}`
                }
                mailer(mailBody)
                res.send("Password Reset email is sent")
            } catch (error) {
                return next(error)
            }

        }).catch((err) => {
            next(err)
        });
})

router.get('/passwordReset/checkToken/:token', (req, res, next) => {
    db.User.findOne({ passwordResetToken: req.params.token })
        .then((user) => {
            if (!user) {
                return next({
                    status: 404,
                    message: "Token is invalid"
                })
            }
            res.send('Token is Valid')
        }).catch((err) => {
            next(err)
        });
})

router.put('/passwordReset/reset/:token', (req, res, next) => {
    db.User.findOne({ passwordResetToken: req.params.token })
        .then(async (user) => {
            if (!user) {
                return next({
                    status: 404,
                    message: "Token is invalid"
                })
            }
            try {
                user.password = req.body.password
                user.passwordResetToken = null
                await user.save()
                mailBody = {
                    to: [user.email],
                    subject: "Password Successfully Reset",
                    text: `Your password has been successfully been Reset.`
                }
                res.send('Password is Updated')
            } catch (error) {
                next(error)
            }
        }).catch((err) => {
            next(err)
        });
})
module.exports = router;