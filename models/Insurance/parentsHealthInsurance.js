const mongoose = require("mongoose");

const insuranceSchema = new mongoose.Schema(
  {
    insuranceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Insurance",
    },
    ageCriteria: {
      type: String,
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
    specializedInvestigationCoverage: {
      type: String,
    },
    waitingPeriod: {
      type: String,
    },
    maternity: {
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
  "Parent Health Insurance",
  insuranceSchema,
  "parent health insurances"
);
