const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    hospitalId: {
        type: String,
        required: true,
      },
    doctorIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        default: []
      },
    ],
    departmentName: {
      type: String,
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

module.exports = mongoose.model("Department", departmentSchema, "departments")
