const mongoose = require("mongoose");

const insuranceSchema = new mongoose.Schema(
  {
    insuranceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Insurance",
      },
      packageName: {
        type: String,
      },
      packageLogo: {
        type: String,
      },
      medicalCover: {
        type: String,
      },
      coveringUpto: {
          type: String,
      },
      adndCoverage : {
        type: String,
      },
      repatriationCoverage : {
        type: String,
        required: true,
      },
      medExpensesHospitalizationCoverage : {
        type: String,
        required: true,
      },
      returnOfDependentChildrenCoverage : {
        type: String,
        required: true,
      },
      repatriationIllnessInjuryCoverage  : {
        type: String,
        required: true,
      },
      emergencyReturnHomeCoverage  : {
        type: String,
        required: true,
      },
      medicineDeliveryCoverage  : {
        type: String,
        required: true,
      },
      flightDelay  : {
        type: String,
        required: true,
      },
      passportLoss  : {
        type: String,
        required: true,
      },
    luggageArrivalDelay: {
      type: String,
      required: true,
    },
    baggageLoss : {
      type: String,
      required: true,
    },
    policyFile: {
      type: String,
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
    heading: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model(
  "Individual Health Insurance",
  insuranceSchema,
  "individual health insurances"
);
