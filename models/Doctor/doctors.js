const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    hospitalIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hospital",
        default: []
      },
    ],
    departmentIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dapartment",
        default: []
      },
    ],
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
      required: true,
    },
    cnicOrPassportNo: {
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
    services: {
      type: String,
      required: true,
    },
    clinicName: {
      type: String,
      required: true,
    },
    clinicAddress: {
      type: String,
      required: true,
    },
    clinicExperiences: {
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
    isVerified: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Doctor", doctorSchema, "doctors");
