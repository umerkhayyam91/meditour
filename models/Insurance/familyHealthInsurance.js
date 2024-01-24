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
      required: true,
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
      required: true,
    },
    accidentalEmergencyLimits : {
        type: String,
        required: true,
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
      required: true,
    },
    claimProcess: {
      type: String,
      required: true,
    },
    heading: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    actualPrice: {
      type: String,
      required: true,
    },
    meditourPrice: {
      type: String,
      required: true,
    },
    perYear: {
      type: String,
      required: true,
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
