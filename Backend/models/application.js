const mongoose = require('mongoose');
const applicationScehma = new mongoose.Schema({
    applicantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    internshipId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InternshipDetails'
    },
    answers: [{ type: String }]
})
module.exports = mongoose.model('Application', applicationScehma);