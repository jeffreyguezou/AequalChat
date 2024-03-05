const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  email: { type: String, unique: true },
  preferences: String,
  bio: String,
});

module.exports = mongoose.model("User", UserSchema);
