const mongoose = require("mongoose");

const ambulanceSchema = new mongoose.Schema(
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
    companyName: {
      type: String,
    },
    companyDetail: {
      type: String,
    },
    authorizedName: {
      type: String,
    },
    authorizedDetail: {
      type: String,
      required: true,
    },
    authorizedCnic: {
      type: String,
      required: true,
    },
    qualification: {
      type: String,
      required: true,
    },
    emergencyContact: {
      type: String,
      required: true,
    },
    registrationNumber: {
      type: String,
      required: true,
    },
    cellNo: {
      type: String, 
      required: true,
    },
    ambulanceEquipDetail: {
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
    taxFileImage: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Ambulance Company", ambulanceSchema, "ambulance companies");