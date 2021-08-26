const moongoose = require('mongoose');
const registrationchema = new moongoose.Schema({
    name: String,
    college: String,
    year: String,
    dept: String,
    email: String,
    contactNumber: String
})
module.exports = moongoose.model('EventRegistration', registrationchema);