const mongoose = require("mongoose");
const achSchema = new mongoose.Schema({
  title: String,
  reward:String,
  date: {
    type: Date,
  },
  description: String,
  link:String,
});

module.exports = mongoose.model("Achievement", achSchema);
