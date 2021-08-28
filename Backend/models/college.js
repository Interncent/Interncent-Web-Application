const mongoose = require('mongoose');
const collegeScehma = new mongoose.Schema({
    name: String,
    address: String,
    logo: String,
    colorTheme: { primary: String, secondary: String },
    premium: Boolean,
    departments: [String],
    internshipCarousel: [String],
    eventCarousel: [String],
    facultyEmails: [String],
    studentEmails: [String],
    councilEmails: [String],
    alumniEmail: [String],
});

module.exports = mongoose.model('College', collegeScehma);