const mongoose = require("mongoose");

const donationListSchema = new mongoose.Schema(
  {
    donationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donation",
    },
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Packages",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    mrNo: {
      type: String,
    },
    donorName: {
      type: String,
    },
    donationPurpose: {
      type: String,
    },
    donationAmount: {
      type: Number,
    }
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model(
  "Donor List",
  donationListSchema,
  "donor list"
);
