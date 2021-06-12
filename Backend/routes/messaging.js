const express = require('express');
const router = express.Router();
const db = require('../models');
const conversation = require('../models/conversation');

router.put('/new/:id', async (req, res, next) => {
    try {
        var user = await db.User.findById(req.body.uid).populate('interactions').exec()
        var convId = ""
        user.interactions.forEach(i => {
            if (i.otherUser.equals(req.params.id)) {
                convId = i.conversation
                return;
            }
        });
        if (convId !== "") {
            return res.status(200).send({ convId })
        } else {
            db.User.findById(req.params.id)
                .then((otherUser) => {
                    if (!otherUser) {
                        return next({ status: 404, message: 'User Not Found' })
                    }
                    db.Conversation.create({})
                        .then(async (conversation) => {
                            try {
                                let interaction = await db.Interaction.create({ conversation: conversation._id, otherUser })
                                conversation.interactionId = interaction._id
                                await user.interactions.push(interaction)
                                await user.save()
                                await conversation.save()
                                return res.status(200).send({ convId: conversation._id })
                            } catch (error) {
                                next(error)
                            }
                        }).catch((err) => {
                            next(err)
                        });
                }).catch((err) => {

                });
        }


    } catch (error) {
        next(error)
    }

})

router.put('/interactions', (req, res, next) => {
    db.User.findById(req.body.uid, 'interactions').populate({ path: 'interactions', populate: { path: 'otherUser', select: 'fname lname email photo' } }).exec()
        .then((user) => {
            res.send(user.interactions)
        }).catch((err) => {
            next(err)
        });
})


module.exports = router