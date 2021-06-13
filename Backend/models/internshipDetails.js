const mongoose = require('mongoose');
const internshipDetailsSchema = new mongoose.Schema({
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  title: String,
  skillsRequired: [{
    type: String
  }],
  duration: Number,
  applyBy: Date,
  posted_on: {
    type: Date,
    default: Date.now
  },
  numberOpenings: Number,
  otherRequirements: String,
  department: String,
  perks: String,
  whoCanApply: String,
  applications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application'
    }
  ],
  description: String,
  type: String,
  completed: {
    type: Boolean,
    default: false
  },
  category: ''
});

module.exports = mongoose.model('InternshipDetails', internshipDetailsSchema);