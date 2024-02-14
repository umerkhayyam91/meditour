const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema({
  userName: { type: String },
  email: { type: String, required: true },
  loc: {
    type: [Number], // Array of two numbers: [longitude, latitude]
    index: { type: "2dsphere", sparse: true }, // Use an object for index definition
    required: true,
  },
});
userSchema.index({ loc: "2dsphere" });

module.exports = mongoose.model("User", userSchema, "users");
