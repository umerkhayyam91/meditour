const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  companyName: String,
  flightsNo: String,
  companyLogo: String,
  from: String,
  to: String,
  className: String,
  departTime: String,
  designationTime: String,
  passengers: String,
  infant: String,
  directOrStay: {
    type: String,
    enum: ["direct", "stay"]
  },
  stayDesignation: String,
  stayduration: String,
  nextFlightNo: String,
  afterStayDepartTime: String,
  afterStayDesignationTime: String,
});

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
    className: {
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
    afterStayDepartTime: {
      type: String,
      required: true,
    },
    afterStayDesignationTime: {
      type: String,
      required: true,
    },
    winglets: {
      type: Boolean
    },
    webBrowsing: {
      type: Boolean
    },
    streamingEntertainment: {
      type: Boolean
    },
    lightMealAvailability: {
      flightA: Boolean,
      flightB: Boolean
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
    cancelPolicyDescription: {
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