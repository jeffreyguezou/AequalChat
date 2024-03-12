const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  profile: String,
  email: { type: String, unique: true },
  preferences: String,
  bio: String,
  friends: Array,
});

module.exports = mongoose.model("User", UserSchema);
