const mongoose = require("mongoose");

const bookingRequestSchema = new mongoose.Schema(
  {
    customerName: {
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
      default: pending,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Booking Request", bookingRequestSchema, "booking requests");
