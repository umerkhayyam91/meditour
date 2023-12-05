const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema(
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
    hospitalFirstName: {
      type: String,
      required: true,
    },
    hospitalLastName: {
      type: String,
      required: true,
    },
    pmdcNumber: {
      type: String,
      required: true,
    },
    pmdcExpiryDate: {
      type: String,
      required: true,
    },
    authFirstName: {
      type: String,
      required: true,
    },
    authMiddleName: {
      type: String,
      required: true,
    },
    authLastName: {
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
    hospitalAddress: {
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
    hospitalLogo: {
      type: String,
      required: true,
    },
    pmdcImage: {
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
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Hospital", hospitalSchema, "hospitals");
