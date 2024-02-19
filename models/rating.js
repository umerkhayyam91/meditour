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
        ref: "Users",
        required: true,
      },
      rating: {
        type: Number,
      },
      review: {
        type: String,
      },
      userImage: {
        type: String,
      },
      userName: {
        type: String,
      },
    },
  ],
});

// Create a model for the ratings collection
module.exports = mongoose.model("Rating", ratingSchema, "ratings");
