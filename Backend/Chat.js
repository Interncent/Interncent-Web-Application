const db = require('./models');

function chat(io) {
    console.log('socket started')
    var conversation = null
    var userId = null
    io.on('connection', (socket) => {
        console.log('new client connected');
        socket.emit('yo', null);
        socket.on('join-room', ({ rid, uid }) => {
            console.log(rid,)
            db.User.findById(uid, 'interactions').populate({ path: 'interactions', populate: { path: 'otherUser', select: 'fname lname photo _id email' } })
                .then((result) => {
                    var otherUser = result.interactions.find(i => rid == i.conversation)
                    if (otherUser) {
                        socket.join(rid)
                        db.Conversation.findById(rid).populate({ path: 'messages', populate: { path: "author" } })
                            .then(async a => {
                                try {
                                    let otherUserPopulated = await db.User.findById(otherUser.otherUser, 'fname lname email _id photo')
                                    userId = uid
                                    conversation = a._id
                                    console.log("ROom Join: " + conversation)
                                    await db.Message.updateMany({ conversationId: conversation,  isRead: false }, { isRead: true })
                                    return socket.emit('get-rmess', { conv: a, interactions: result.interactions, otherUser: otherUserPopulated })
                                } catch (error) {
                                    console.log(error)
                                }

                            })
                            .catch(err => {
                                console.log(err)
                            })
                    } else {
                        return socket.emit('wrong-user', null)
                    }


                }).catch((err) => {
                    console.log(err)
                });

        })
        socket.on('leave-room', rid => {
            console.log('leaving room')
            socket.leave(rid)
        })
        socket.on('room-message', data => {
            data.message.conversationId = conversation
            // console.log(data)
            db.Message.create(data.message).then(async m => {
                db.Conversation.findById(data.rid)
                    .then(async a => {
                        if (a.messages.length == 0) {
                            try {
                                let otherUser = await db.User.findById(data.otherUser, 'interactions')
                                otherUser.interactions.push({ otherUser: userId, conversation })
                                await otherUser.save()
                            } catch (error) {
                                console.log(error)
                            }
                        }
                        a.messages.push(m)
                        await a.save()

                    })
                    .catch(err => {
                        console.log(err)
                    })

                db.User.findById(m.author).then(k => {
                    m.author = k
                    io.to(data.rid).emit('new-messr', m)
                })
                    .catch(err => {
                        console.log(err)
                    })

            })

        })

        socket.on('typing', (rid) => {
            socket.broadcast.to(rid).emit('show-typing', null)
        })

        socket.on('not-typing', (rid) => {
            socket.broadcast.to(rid).emit('show-not-typing', null)
        })

        socket.on('disconnect', () => {
            console.log('disconnected')
            db.Conversation.findById(conversation).then(async a => {
                if (a.messages.length == 0) {
                    await db.User.findById(userId, 'interactions').populate('interactions')
                        .then(async (result) => {
                            let index = result.interactions.findIndex(i => a._id.equals(i.conversation))
                            await result.interactions.splice(index, 1)
                            await result.save()
                            await a.remove()
                        }).catch((err) => {
                            console.log(err)
                        });
                }
            })
                .catch(err => {
                    console.log(err)
                })
        });

    });
}
module.exports = chat