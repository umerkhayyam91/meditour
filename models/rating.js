const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.SchemaTypes.ObjectId,
  },
  rating: Number,
});

// Create a model for the reset tokens collection
module.exports = mongoose.model("Rating", ratingSchema, "ratings");
