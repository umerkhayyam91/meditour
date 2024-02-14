const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    unique: true,
  },
  ratings: [
    {
      userId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      review: {
        type: String,
      },
    },
  ],
});

// Create a model for the ratings collection
module.exports = mongoose.model("Rating", ratingSchema, "ratings");
