const mongoose = require("mongoose");

const testSchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
    },
    testName: {
      type: String,
      required: true,
    },
    labId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Laboratory",
    },
    testCode: {
      type: Number,
      required: true,
    },
    testDescription: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    duration: {
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

module.exports = mongoose.model("Tests", testSchema, "tests");
