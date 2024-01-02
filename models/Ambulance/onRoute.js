const mongoose = require("mongoose");

const onRouteSchema = new mongoose.Schema(
  {
    ambulanceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking Request",
      required: true,
    },
    customerId: {
      type: String,
      required: true,
    },
    dateAndTime: {
        type: Date,
        default: Date.now(),
    },
    vehicleNo: {
      type: String,
    },
    status: {
      type: String,
      enum: ["inProcess", "complete"],
      default: "inProcess"
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model(
  "On Route",
  onRouteSchema,
  "on routes"
);
