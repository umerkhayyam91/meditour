const mongoose = require("mongoose");

const physioSchema = new mongoose.Schema(
  {
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    loc: {
      type: [Number], // Array of two numbers: [longitude, latitude]
      index: { type: "2dsphere", sparse: true }, // Use an object for index definition
      required: true,
    },
    name: {
      type: String,
    },
    cnicOrPassNo: {
      type: String,
      required: true,
    },
    qualification: {
      type: String,
      required: true,
    },
    averageRating: {
      type: Number,
    },
    speciality: {
      type: String,
      required: true,
    },
    services: {
      type: String,
      required: true,
    },
    clinicExperiences: {
      type: String,
      required: true,
    },
    clinicName: {
      type: String,
      required: true,
    },
    pmdcNumber: {
      type: String,
      required: true,
    },
    emergencyNo: {
      type: String,
      required: true,
    },
    clinicAddress: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    website: {
      type: String,
    },
    twitter: {
      type: String,
    },
    youtube: {
      type: String,
    },
    instagram: {
      type: String,
    },
    incomeTaxNo: {
      type: String,
      required: true,
    },
    salesTaxNo: {
      type: String,
      required: true,
    },
    bankName: {
      type: String,
      required: true,
    },
    accountHolderName: {
      type: String,
      required: true,
    },
    accountNumber: {
      type: String,
      required: true,
    },
    physioImage: {
      type: String,
      required: true,
    },
    cnicImage: {
      type: String,
      required: true,
    },
    clinicLogo: {
      type: String,
      required: true,
    },
    pmdcImage: {
      type: String,
      required: true,
    },
    taxFileImage: {
      type: String,
      required: true,
    },
    fcmToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Physiotherapist", physioSchema, "physiotherapists");
