const mongoose = require("mongoose");

const ePrescriptionSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    ePrescription: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ePrescription = mongoose.model(
  "ePrescription",
  ePrescriptionSchema,
  "e-prescription"
);

module.exports = ePrescription;
