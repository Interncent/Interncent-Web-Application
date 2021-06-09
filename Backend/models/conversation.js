const mongoose = require('mongoose');
const db = require('./index')
const convSchema = new mongoose.Schema({
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message'
        }
    ],
    interactionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Interaction'
    }
});

convSchema.pre('save', async (next) => {
    try {
        var interaction = await db.Interaction.find(this.interactionId)
        interaction.lastUpdated = Date.now()
        await interaction.s
        return next()
    } catch (error) {
        next(error)
    }
})
module.exports = mongoose.model('Conversation', convSchema)