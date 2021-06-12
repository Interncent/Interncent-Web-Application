const db = require('./models');
const cloudinary = require('cloudinary');
const multer = require('multer');
cloudinary.config({
    cloud_name: 'ved13',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
var storage = multer.diskStorage({
    filename: function (req, file, callback) {
        callback(null, Date.now() + file.originalname);
    }
});
var imageFilter = function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter });


function chat(io) {
    console.log('socket started')
    io.on('connection', (socket) => {
        console.log('new client connected');
        socket.emit('yo', null);
        socket.on('join-room-justsocket', ({ rid, uid }) => {
            db.User.findById(uid, 'interactions').populate({ path: 'interactions', populate: { path: 'otherUser', select: 'fname lname photo _id email' } })
                .then((result) => {
                    var otherUser = result.interactions.find(i => rid == i.conversation)
                    if (otherUser) {
                        socket.join(rid)
                    } else {
                        return socket.emit('wrong-user', null)
                    }
                }).catch((err) => {
                    console.log(err)
                });
        })
        socket.on('join-room', ({ rid, uid }) => {
            // console.log(rid,)
            db.User.findById(uid, 'interactions').populate({ path: 'interactions', populate: { path: 'otherUser', select: 'fname lname photo _id email' } })
                .then((result) => {
                    var otherUser = result.interactions.find(i => rid == i.conversation)
                    if (otherUser) {
                        socket.join(rid)


                        db.Conversation.findById(rid).populate({ path: 'messages', populate: { path: "author" } })
                            .then(async a => {
                                try {
                                    let otherUserPopulated = await db.User.findById(otherUser.otherUser, 'fname lname email _id photo')
                                    console.log("ROom Join: " + a._id)
                                    var i          // updating unreadmessages of interactions
                                    for (i = 0; i < result.interactions.length; i++) {
                                        if (result.interactions[i].conversation == rid) continue // coz will read all messages
                                        result.interactions[i].unreadmessages = await db.Message.find({ conversationId: result.interactions[i].conversation, author: result.interactions[i].otherUser._id, isRead: false }).count()
                                    }
                                    await db.Message.updateMany({ conversationId: a._id, isRead: false, author: otherUserPopulated._id }, { isRead: true })
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
            data.message.conversationId = data.rid
            // console.log(data) update date
            db.Message.create(data.message).then(async m => {
                db.Conversation.findById(data.rid)
                    .then(async a => {
                        if (a.messages.length == 0) {
                            try {
                                let otherUser = await db.User.findById(data.otherUser, 'interactions')
                                let interaction = await db.Interaction.create({ otherUser: data.uid, conversation: data.rid })
                                otherUser.interactions.push(interaction)
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


                io.to(data.rid).emit('new-messr', m)


            })

        })

        socket.on('typing', (rid) => {
            socket.broadcast.to(rid).emit('show-typing', null)
        })

        socket.on('not-typing', (rid) => {
            socket.broadcast.to(rid).emit('show-not-typing', null)
        })

        socket.on('disconnectchat', (rid, uid) => {
            console.log('disconnected', rid, uid)
            db.Conversation.findById(rid)
                .then(async a => {
                    if (a.messages.length == 0) {
                        await db.User.findById(uid, 'interactions').populate('interactions')
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