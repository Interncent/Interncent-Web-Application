const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema({
    text: String,
    created: {
        type: Date,
        default: Date.now
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    type: String,
    imgUrl: String,
    isRead: {
        type: Boolean,
        default: false
    }
});
module.exports = mongoose.model('Message', messageSchema);