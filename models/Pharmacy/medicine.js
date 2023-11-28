const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
  {
    generic: {
      type: String,
    },
    medicineBrand: {
      type: String,
    },
    medicineType: {
      type: String,
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
      type: String,
      required: true,
    },
    actualPrice: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Medicine", medicineSchema, "medicines");
