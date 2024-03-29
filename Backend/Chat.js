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

var onlineprofile = {}

function chat(io) {
    console.log('socket started')
    io.on('connection', (socket) => {
        console.log('new client connected');
        socket.emit('yo', null);
        socket.on("statusonline", ({ uid }) => {
            onlineprofile[uid] = socket;
            socket.userId = uid
        })
        socket.on('join-room-justsocket', (rid) => {
            socket.join(rid)
        })
        socket.on('join-room', ({ rid, uid }) => {
            // console.log(rid,uid)
            db.User.findById(uid, 'interactions').populate({ path: 'interactions', populate: [{ path: 'otherUser', select: 'fname lname photo _id email' }, { path: 'conversation', select: 'updatedAt _id' }] })
                .then(async (result) => {
                    var otherUser = await result.interactions.find(i => i.conversation._id.equals(rid))
                    if (otherUser) {
                        socket.join(rid)
                        db.Conversation.findById(rid).populate({ path: 'messages', populate: { path: "author" } })
                            .then(async a => {
                                try {
                                    let otherUserPopulated = await db.User.findById(otherUser.otherUser, 'fname lname email _id photo')
                                    var i          // updating unreadmessages of interactions
                                    for (i = 0; i < result.interactions.length; i++) {
                                        if (result.interactions[i].conversation._id.equals(rid)) {
                                            continue // coz will read all messages
                                        }
                                        result.interactions[i].unreadmessages = await db.Message.find({ conversationId: result.interactions[i].conversation._id, author: result.interactions[i].otherUser._id, isRead: false }).count()
                                    }
                                    try {
                                        await db.Message.updateMany({ conversationId: a._id, isRead: false, author: otherUserPopulated._id }, { isRead: true })

                                    } catch (error) {
                                        console.log(error)
                                    }
                                    return socket.emit('get-rmess', { conv: a, interactions: result.interactions, otherUser: otherUserPopulated })
                                } catch (error) {
                                    console.log(error)
                                }

                            })
                            .catch(err => {
                                return console.log(err)
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
                                let currentUser = await db.User.findById(data.uid, '_id fname lname emial photo')
                                otherUser.interactions.push(interaction)
                                await otherUser.save()
                                interactionCopy = { _id: interaction._id, otherUser: currentUser }
                                interactionCopy.conversation = { _id: a._id, updatedAt: a.updatedAt }
                                console.log(interactionCopy)

                                if (data.otherUser in onlineprofile) {
                                    console.log("emiting socket event to create interaction")

                                    try {
                                        console.log(typeof (onlineprofile[data.otherUser].join))
                                        await onlineprofile[data.otherUser].join(data.rid) //Not Joining Room
                                        onlineprofile[data.otherUser].emit("newinteraction", interactionCopy)

                                        console.log("Othe User Joined********************")
                                    } catch (error) {
                                        console.log('New Interaction error:' + error)
                                    }

                                }

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

                const clients = io.sockets.adapter.rooms.get(data.rid);
                for (const clientId of clients) {

                    //this is the socket of each client in the room.
                    const clientSocket = io.sockets.sockets.get(clientId);
                    console.log(clientSocket.userId + "**************")

                }
                io.to(data.rid).emit('new-messr', m)


            })

        })

        socket.on('typing', (rid) => {
            socket.broadcast.to(rid).emit('show-typing', null)
        })

        socket.on('not-typing', (rid) => {
            socket.broadcast.to(rid).emit('show-not-typing', null)
        })

        // When message is seen
        socket.on('seen-message', ({ mid, rid }) => {
            db.Message.findByIdAndUpdate(mid, { isRead: true })
                .then((result) => {
                    console.log(rid)
                    console.log('*****Reading msg')
                    socket.broadcast.to(rid).emit('message-is-seen', mid)
                }).catch((err) => {
                    console.log(err)
                });
        })

        socket.on('disconnectchat', (rid, uid) => {
            console.log('disconnected', rid, uid)
            db.Conversation.findById(rid)
                .then(async a => {
                    if (a.messages.length == 0) {
                        await db.User.findById(uid, 'interactions').populate('interactions')
                            .then(async (result) => {
                                let index = result.interactions.findIndex(i => a._id.equals(i.conversation))
                                await db.Interaction.findByIdAndRemove(result.interactions[index]._id)
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
        socket.on("disconnect", () => {
            delete onlineprofile[socket.userId]
        })
    });
}
module.exports = chat