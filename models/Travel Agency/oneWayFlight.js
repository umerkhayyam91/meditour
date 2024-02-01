const mongoose = require("mongoose");

const oneWayFlightSchema = new mongoose.Schema(
  {
    agencyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Travel Agency",
    },
    companyName: {
      type: String,
      required: true,
    },
    flightsNo: {
      type: String,
    },
    companyLogo: {
      type: String,
    },
    from: {
      type: String,
    },
    to: {
      type: String,
    },
    class: {
      type: String,
    },
    departTime: {
      type: String,
      required: true,
    },
    designationTime: {
      type: String,
      required: true,
    },  
    passengers: {
      type: String,
      required: true,
    },
    infant: {
      type: String,
      required: true,
    },
    directOrStay: {
      type: String,
      enum: ["direct", "stay"]
    },
    stayDesignation: {
      type: String,
    },
    stayduration: {
      type: String,
    },
    nextFlightNo: {
      type: String,
    },
    departTime: {
      type: String,
      required: true,
    },
    designationTime: {
      type: String,
      required: true,
    },
    handBag: {
      type: String,
      required: true,
    },
    baggageWeight: {
      type: String,
      required: true,
    },
    cancelationDuration: {
      type: String,
      required: true,
    },
    cancelationDeduct: {
      type: String,
      required: true,
    },
    ticketsCount: {
      type: String,
      required: true,
    },
    cnicancelPolicyDescriptioncImage: {
      type: String,
      required: true,
    },
    meditourPrice: {
      type: String,
      required: true,
    },
    actualPrice: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("One Way Flight", oneWayFlightSchema, "one way flights");