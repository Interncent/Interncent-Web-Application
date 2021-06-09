const mongoose = require('mongoose')
const interactionSchema = new mongoose.Schema({
    conversation:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation'
    },
    otherUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    lastUpdated: {
        default: Date.now,
        type: Date
    }
})

module.exports = mongoose.model('Interaction', interactionSchema)