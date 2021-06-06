const mongoose = require('mongoose');
const convSchema = new mongoose.Schema({
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message'

        }
    ]
});
module.exports = mongoose.model('Conversation', convSchema)