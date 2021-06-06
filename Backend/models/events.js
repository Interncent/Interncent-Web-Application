const moongoose = require('mongoose');
const eventSchema = new moongoose.Schema({
    title: String,
    venue: String,
    startTime: String,
    endTime: String,
    date: {
        type: Date
    },
    link: String,
    description:String
})
module.exports = moongoose.model('Event', eventSchema);