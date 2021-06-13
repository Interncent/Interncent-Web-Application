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
    answers: [{ type: String }],
    state: {
        type: String,
        default: 'Applied'
    },
    appliedOn: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('Application', applicationScehma);