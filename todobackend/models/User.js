const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: { type: String, required: [true, "username is required"] },
  email: { type: String, required: [true, "email is required"] },
  password: { type: String, required: [true, "password is required"] },
  displayPicture: { type: String, required: false },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
