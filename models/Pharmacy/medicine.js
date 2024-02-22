const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
  {
    pharmId: {
      type: String,
      required: true,
    },
    medCode: {
      type: String,
      required: true,
    },
    generic: {
      type: String,
      required: true,
    },
    medicineName: {
      type: String,
      required: true,
    },
    medicineBrand: {
      type: String,
      required: true,
    },
    medicineType: {
      type: String,
      required: true,
    },
    medicineImage: {
      type: String,
      required: true,
    },
    strength: {
      type: String,
      required: true,
    },
    packSize: {
      type: String,
      required: true,
    },
    priceMeditour: {
      type: Number,
      required: true,
    },
    actualPrice: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Medicine", medicineSchema, "medicines");
