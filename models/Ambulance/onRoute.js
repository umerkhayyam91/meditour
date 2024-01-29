const mongoose = require("mongoose");

const onRouteSchema = new mongoose.Schema(
  {
    ambulanceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ambulance Company",
      required: true,
    },
    customerId: {
      type: String,
      ref: "User",
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
