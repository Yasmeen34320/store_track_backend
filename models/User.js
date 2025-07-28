const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"], required: true },
  name: String,
  phone: String
}, {
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model("User", userSchema);
