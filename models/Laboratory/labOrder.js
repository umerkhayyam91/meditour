const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
  },
  testCode: {
    type: String,
    required: true,
  },
  labId: {
    type: mongoose.Schema.Types.ObjectId,
        ref: "Laboratory",
  },
  testName: {
    type: String,
    required: true,
  },
  patientName: {
    type: String,
    required: true,
  },
  MR_NO: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  results: {
    type: String,
    required: true,
  },
},
{
  timestamps: true,
});

module.exports = mongoose.model("LabOrder", orderSchema, "lab orders");
