const mongoose = require("mongoose");
const proScehma = new mongoose.Schema({
  title: String,
  startdate: {
    type: Date,
  },
  enddate: {
    type: Date,
  },
  description: String,
  link:String,
});

module.exports = mongoose.model("Project", proScehma);
