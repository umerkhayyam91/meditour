const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    hospitalId: {
        type: String,
        required: true,
      },
    departmentName: {
      type: String,
      required: true,
    },
    availableDoctors: {
      type: Number,
      required: true,
    },
    dapartmentLogo: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Dapartment", departmentSchema, "dapartments")
