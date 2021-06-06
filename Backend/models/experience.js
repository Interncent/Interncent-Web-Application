const mongoose = require("mongoose");
const expScehma = new mongoose.Schema({
  title: String,
  type: String,
  company: String,
  startdate: {
    type: Date,
  },
  enddate: {
    type: Date,
  },
  description: String,
});

module.exports = mongoose.model("Experience", expScehma);
