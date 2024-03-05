const mongoose = require("mongoose");

const OtpSchema = new mongoose.Schema({
  email: String,
  otp: Number,
});

module.exports = mongoose.model("Otp", OtpSchema);
