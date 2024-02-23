const mongoose = require("mongoose");

const pharmacySchema = new mongoose.Schema(
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
    pharmacyFirstName: {
      type: String,
      required: true,
    },
    pharmacyLastName: {
      type: String,
      required: true,
    },
    pharmacyLicenseNumber: {
      type: String,
      required: true,
    },
    ownerName: {
      type: String,
      required: true,
    },
    cnicOrPassportNo: {
      type: String,
      required: true,
    },
    pharmacyAddress: {
      type: String,
      required: true,
    },
    loc: {
      type: [Number], // Array of two numbers: [longitude, latitude]
      index: { type: "2dsphere", sparse: true }, // Use an object for index definition
      required: true,
    },
    emergencyNo: {
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
    facebook: {
      type: String,
    },
    instagram: {
      type: String,
    },
    incomeTaxNo: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    availabilityDuration: {
      type: String,
    },
    availability: {
      type: Boolean,
    },
    averageRating: {
      type: Number,
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
    pharmacyLogo: {
      type: String,
      required: true,
    },
    pharmacyLicenseImage: {
      type: String,
      required: true,
    },
    cnicImage: {
      type: String,
      required: true,
    },
    taxFileImage: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    fcmToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Pharmacy", pharmacySchema, "pharmacies");
