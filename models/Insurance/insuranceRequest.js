const mongoose = require("mongoose");

const insuranceRequestSchema = new mongoose.Schema(
  {
    insuranceCompanyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Insurance",
    },
    insuranceId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    userName: {
      type: String,
    },
    insuranceFor: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model(
  "Insurance Request",
  insuranceRequestSchema,
  "insurance requests"
);
