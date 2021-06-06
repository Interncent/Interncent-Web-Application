const express = require('express');
const router = express.Router();
const db = require('../models');

router.get('/conversation/:id', (req, res, next) => {
    console.log('hello ')
    db.Conversation.find(req.params.id).populate('messages').exec()
        .then((conv) => {
            return res.status(200).send(conv)
        }).catch((err) => {
            return next(err)
        });
})


module.exports = router