const mongoose = require('mongoose');
const hiddenSchema = new mongoose.Schema({
    facultyEmails: [{ type: String }],
    councilEmails: [{ type: String }],
    alumniEmails: [{ type: String }],
    subscribed: [{ type: String }]
});

module.exports= mongoose.model('HiddenData', hiddenSchema)