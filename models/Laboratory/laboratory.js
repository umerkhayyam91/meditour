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
    labExpiryDate: {
      type: String,
      required: true,
    },
    OwnerFirstName: {
      type: String,
      required: true,
    },
    OwnerMiddleName: {
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
    labAddress: {
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
      required: true,
    },
    twitter: {
      type: String,
      required: true,
    },
    facebook: {
      type: String,
      required: true,
    },
    instagram: {
      type: String,
      required: true,
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
    accountName: {
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
    MR_NO: {
      type: Number,
      required: true,
      unique: true
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

module.exports = mongoose.model("Laboratory", labSchema, "laboratories");
