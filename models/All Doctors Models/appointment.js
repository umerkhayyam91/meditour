const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String, // Format: 'HH:mm'
      required: true,
    },
    endTime: {
      type: String,
    },
    appointmentType: {
      type: String,
      enum: ["videoConsultation", "physical"],
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
    },
    ePrescription: {
      type: mongoose.Schema.Types.ObjectId,
    },
    notes: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model(
  "Appointment",
  appointmentSchema,
  "appointments"
);

module.exports = Appointment;
