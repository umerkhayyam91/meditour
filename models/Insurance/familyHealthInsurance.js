const mongoose = require("mongoose");

const insuranceSchema = new mongoose.Schema(
  {
    insuranceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Insurance",
    },
    yourAgeCriteria: {
      type: String,
    },
    spouseAgeCriteria: {
      type: String,
    },
    kidsAge: {
      ageStart: String,
      ageEnd: String,
    },
    hospitalizationLimit: {
      startlimit: String,
      endLimit: String,
    },
    packageName: {
      type: String,
    },
    packageLogo: {
      type: String,
    },
    hospitalizationPerPerson: {
      type: String,
    },
    dailyRoomAndBoardLimit: {
      type: String,
    },
    claimPayoutRatio: {
      type: String,
    },
    hospitals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "hospital",
      },
    ],
    laboratories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "hospital",
      },
    ],
    icuCcuLimits: {
      type: String,
    },
    accidentalEmergencyLimits: {
      type: String,
    },
    ambulanceCoverage: {
      type: String,
    },
    OPD: {
      type: String,
    },
    waitingPeriod: {
      type: String,
    },
    policyDocument: {
      type: String,
    },
    claimProcess: {
      type: String,
    },
    heading: {
      type: String,
    },
    description: {
      type: String,
    },
    actualPrice: {
      type: String,
    },
    meditourPrice: {
      type: String,
    },
    perYear: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model(
  "Family Health Insurance",
  insuranceSchema,
  "family health insurances"
);
