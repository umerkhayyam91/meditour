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
    pharmFirstName: {
      type: String,
      required: true,
    },
    pharmLastName: {
      type: String,
      required: true,
    },
    pharmLicenseNumber: {
      type: String,
      required: true,
    },
    licenceExpiryDate: {
      type: String,
      required: true,
    },
    OwnerFirstName: {
      type: String,
      required: true,
    },
    OwnerLastName: {
      type: String,
      required: true,
    },
    cnicOrPassportNo: {
      type: String,
      required: true,
    },
    cnicOrPassportExpiry: {
      type: String,
      required: true,
    },
    pharmAddress: {
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
    pharmImage: {
      type: String,
      required: true,
    },
    ownerImage: {
      type: String,
      required: true,
    },
    taxFileImage: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Pharmacy", labSchema, "pharmacies");
