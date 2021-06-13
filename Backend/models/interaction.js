const mongoose = require('mongoose')
const interactionSchema = new mongoose.Schema({
    conversation:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation'
    },
    unreadmessages: Number,
    otherUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    
})

module.exports = mongoose.model('Interaction', interactionSchema)