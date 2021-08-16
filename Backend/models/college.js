const mongoose = require('mongoose');
const collegeScehma = new mongoose.Schema({
    name: String,
    address: String,
    logo: String,
    colorScheme: { primary: String, secondary: String },
    premium: Boolean,
    facultyEmails: [String],
    studentEmails: [String],
    councilEmails: [String],
    alumniEmail: [String],
});

module.exports = mongoose.model('College', collegeScehma);