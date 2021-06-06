const mongoose = require('mongoose');
const certScehma = new mongoose.Schema({
    link: String,
    title: String,
    date: {
        type: Date
    },
    provider: String,
    logo: String
});

module.exports = mongoose.model('Certificate', certScehma);