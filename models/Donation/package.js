const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
  {
    donationId: {
      type: String,
    },
    userIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        default: [],
      },
    ],
    donationName: {
      type: String,
    },
    targetAudience: {
      type: String,
    },
    requiredAmount: {
      type: Number,
    },
    totalDays: {
      type: String,
    },
    description: {
      type: String,
    },
    images: [
        {
          type: "String",
        },
      ],
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Packages", packageSchema, "donation packages");
