const mongoose = require("mongoose");

const donationCriteriaSchema = new mongoose.Schema(
  {
    donationId: {
      type: String,
    },
    criteriaName: {
      type: String,
      enum: ["education", "food"]
    },
    description: {
      type: String,
    },
    image: String,
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model(
  "Donation Criteria",
  donationCriteriaSchema,
  "donation criterion"
);
