const mongoose = require("mongoose");
const acceptedRequestsSchema = new mongoose.Schema(
  {
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
    
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model(
  "Accepted Request",
  acceptedRequestsSchema,
  "accepted requests"
);

