const moongoose = require('mongoose');
const eventSchema = new moongoose.Schema({
    college: String,
    organiser: {
        type: moongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: String,
    venue: String,
    startTime: String,
    endTime: String,
    date: {
        type: Date
    },
    category: String,
    link: String,
    photo: String,
    description: String,
    applyBy: Date,
    registrations: [
        {
            type: moongoose.Schema.Types.ObjectId,
            ref: 'EventRegistration'
        }
    ],
    prizes: []
})
module.exports = moongoose.model('Event', eventSchema);