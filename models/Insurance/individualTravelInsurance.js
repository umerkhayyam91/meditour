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
    adndCoverage: {
      type: String,
    },
    repatriationCoverage: {
      type: String,
    },
    medExpensesHospitalizationCoverage: {
      type: String,
    },
    returnOfDependentChildrenCoverage: {
      type: String,
    },
    repatriationIllnessInjuryCoverage: {
      type: String,
    },
    emergencyReturnHomeCoverage: {
      type: String,
    },
    medicineDeliveryCoverage: {
      type: String,
    },
    flightDelay: {
      type: String,
    },
    passportLoss: {
      type: String,
    },
    luggageArrivalDelay: {
      type: String,
    },
    baggageLoss: {
      type: String,
    },
    policyFile: {
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
    tripType: {
      type: String,
      enum: ["singleTrip", "multipleTrips"]
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model(
  "Individual Travel Insurance",
  insuranceSchema,
  "individual travel insurances"
);
