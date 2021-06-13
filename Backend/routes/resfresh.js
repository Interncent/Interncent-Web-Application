const mongoose = require('mongoose')
const db = require('../models/index');
const router = require('express').Router()
const { loginRequired, ensureCorrectUser, correctAccess } = require('../middleware/index')

// Get user by id
router.get('/api/:secureId/user/:id', loginRequired, ensureCorrectUser, correctAccess, (req, res, next) => {
    db.User.findById(req.params.id, '-password').populate('events').populate({ path: 'applications', populate: { path: 'internshipId', select: 'title duration _id description category' }, select: 'internshipId state _id' }).populate('certificates').populate('experiences').populate('projects').populate('achievements').populate({ path: "internshipsOffered", select: "title category duration category description" }).populate({ path: 'members', populate: { path: 'member', select: 'fname lname _id email photo' } }).populate({ path: 'commented', populate: { path: 'post', select: '_id image author', populate: { path: 'author', select: ' fname lname email' } } }).populate({ path: 'liked', populate: { path: 'post', select: '_id image author', populate: { path: 'author', select: 'email fname lname photo' } } }).exec()
        .then((user) => {
            if (user) {
                return res.status(200).send(user);
            } else {
                next({
                    status: 404,
                    message: 'User Not Found'
                })
            }
        }).catch((err) => {
            next(err);
        });
});

module.exports = router