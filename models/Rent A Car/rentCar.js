const mongoose = require("mongoose");

const travelAgencySchema = new mongoose.Schema(
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
    ownerName: {
      type: String,
    },
    fatherName: {
      type: String,
    },
    cnicOrPassportNo: {
      type: String,
      required: true,
    },
    expiryDate: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
    },
    companyLastName: {
      type: String,
      required: true,
    },
    licenseNo: {
      type: String,
    },
    licenceExpiry: {
      type: String,
    },
    companyAddress: {
      type: String,
      required: true,
    },  
    companyExperiences: {
      type: String,
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
    companyLogo: {
      type: String,
      required: true,
    },
    licenseImage: {
      type: String,
      required: true,
    },
    ownerImage: {
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
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Rent A Car", travelAgencySchema, "rent cars");