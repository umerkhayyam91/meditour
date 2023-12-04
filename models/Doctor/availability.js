const mongoose = require("mongoose");

const availabilityPeriodSchema = new mongoose.Schema({
  startTime: {
    type: String, // Format: 'HH:mm'
    required: true,
  },
  endTime: {
    type: String, // Format: 'HH:mm'
    required: true,
  },
});

const doctorAvailabilitySchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
    },
    availability: [
      {
        dayOfWeek: {
          type: Number, // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
          required: true,
        },
        periods: [availabilityPeriodSchema],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const DoctorAvailability = mongoose.model(
  "Availability",
  doctorAvailabilitySchema,
  "availability"
);

module.exports = DoctorAvailability;
