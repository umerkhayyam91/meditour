const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor"
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users"
    },
    symptoms: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const history = mongoose.model(
  "History",
  historySchema,
  "history"
);

module.exports = history;
