const mongoose = require("mongoose");

const bookingRequestSchema = new mongoose.Schema(
  {
    ambulanceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ambulance Company",
      required: true,
    },
    customerId: {
      type: String,
      required: true,
    },
    phoneNo: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    dateAndTime: {
      type: Date,
      default: Date.now(),
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "accept", "reject"],
      default: "pending"
    },
  },
  {
    timestamps: true,
  }
);
  module.exports = mongoose.model(
  "Booking Request",
  bookingRequestSchema,
  "booking requests"
);
