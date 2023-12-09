const mongoose = require("mongoose");
const AmbulanceCompany = require("../../models/Ambulance/ambulanceCompany")

const ambulanceSchema = new mongoose.Schema(
  {
    ambulanceCompanyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ambulance Company"
    },
    vehicleType: {
      type: String,
    },
    vehicleName: {
      type: String,
    },
    vehicleModel: {
      type: String,
    },
    vehicleYear: {
      type: String,
    },
    vehicleColor: {
      type: String,
    },
    vehicleFacilities: {
      type: String,
      required: true,
    },
    registrationNo: {
      type: String,
      required: true,
    },
    registrationDate: {
      type: String,
      required: true,
    },
    actualPrice: {
      type: String,
      required: true,
    },
    priceForMeditour: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Ambulance", ambulanceSchema, "ambulance");