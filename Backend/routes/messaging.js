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
                db.User.findById(req.body.uid, 'interactions').populate({ path: 'interactions', populate: [{ path: 'otherUser', select: 'fname lname photo _id email' }, { path: 'conversation', select: 'updatedAt _id' }] })
        .then(async (user) => {
            for (let i = 0; i < user.interactions.length; i++) {
                user.interactions[i].unreadmessages = await db.Message.find({ conversationId: user.interactions[i].conversation, author: user.interactions[i].otherUser._id, isRead: false }).count()
            }
            res.send(user.interactions)
        }).catch((err) => {
            next(err)
        });
})

// Messaging All the Applicants
router.post('/applicants', async (req, res, next) => {
    var user = await db.User.findById(req.body.uid).populate('interactions').exec()
    req.body.otherUserIds.forEach(id => {
        try {
            var convId = ""
            user.interactions.forEach(i => {
                if (i.otherUser.equals(id)) {
                    convId = i.conversation
                    return;
                }
            });
            if (convId !== "") {
                db.Conversation.findById(convId)
                    .then(async (result) => {
                        req.body.message.conversationId = result._id
                        try {
                            let message = await db.Message.create(req.body.message)
                            result.messages.push(message)
                            await result.save()
                            return res.status(200).send('Message Sent')
                        } catch (error) {
                            next(error)
                        }

                    }).catch((err) => {
                        return next(err)
                    });
            } else {
                db.User.findById(id)
                    .then((otherUser) => {
                        if (!otherUser) {
                            return next({ status: 404, message: 'User Not Found' })
                        }
                        db.Conversation.create({})
                            .then(async (conversation) => {
                                req.body.message.conversationId = conversation._id
                                try {
                                    let interaction = await db.Interaction.create({ conversation: conversation._id, otherUser })
                                    let interactionOtherUser = await db.Interaction.create({ conversation: conversation._id, otherUser: user._id })
                                    let message = await db.Message.create(req.body.message)
                                    conversation.messages.push(message)
                                    await user.interactions.push(interaction)
                                    await otherUser.interactions.push(interactionOtherUser)
                                    await user.save()
                                    await conversation.save()
                                    await otherUser.save()
                                    return res.status(200).send('Message Sent')
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
})
router.get

module.exports = router