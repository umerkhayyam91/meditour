const mongoose = require("mongoose");

const labSchema = new mongoose.Schema(
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
    labFirstName: {
      type: String,
      required: true,
    },
    labLastName: {
      type: String,
      required: true,
    },
    labLicenseNumber: {
      type: String,
      required: true,
    },
    OwnerName: {
      type: String,
      required: true,
    },
    cnicOrPassportNo: {
      type: String,
      required: true,
    },
    labAddress: {
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
    labLogo: {
      type: String,
      required: true,
    },
    labLicenseImage: {
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
    isVerified: {
      type: Boolean,
      default: false,
    },
    fcmToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

labSchema.index({ loc: "2dsphere" });

module.exports = mongoose.model("Laboratory", labSchema, "laboratories");
