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
    name: {
      type: String,
    },
    fatherName: {
      type: String,
    },
    DOB: {
      type: String,
      required: true,
    },
    cnicOrPassNo: {
      type: String,
      required: true,
    },
    qualification: {
      type: String,
      required: true,
    },
    speciality: {
      type: String,
      required: true,
    },
    clinicName: {
      type: String,
      required: true,
    },
    clinicLicense: {
      type: String,
      required: true,
    },
    licenceExpiryDate: {
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
    doctorImage: {
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
module.exports = mongoose.model("Doctor", labSchema, "doctors");