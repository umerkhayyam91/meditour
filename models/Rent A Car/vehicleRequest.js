const mongoose = require("mongoose");
const vehicleRequestSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      // ref: "Vehicle",
    },
    rentACarId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      // ref: "Users",
    },

    userName: {
      type: String,
      required: true,
    },
    vehicleModel: {
      type: String,
      required: true,
    },
    dateAndTime: {
      type: Date,
      default: Date.now(),
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
  "Vehicle Request",
  vehicleRequestSchema,
  "vehicle requests"
);
