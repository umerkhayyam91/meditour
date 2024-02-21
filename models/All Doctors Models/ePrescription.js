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
    medicines: [
      {
        medicineName: {
          type: String,
          required: true,
        },
        medicineBrand: {
          type: String,
          required: true,
        },
        medicineStrength: {
          type: String,
          required: true,
        },
        dosage: {
          type: String,
          required: true,
        },
      },
    ],
    test: {
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
