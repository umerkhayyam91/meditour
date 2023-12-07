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

const hospitalAvailabilitySchema = new mongoose.Schema({
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false, // Make hospitalId optional
  },
  availability: [
    {
      dayOfWeek: {
        type: Number,
        required: true,
      },
      periods: [availabilityPeriodSchema],
    },
  ],
});


const clinicAvailabilitySchema = new mongoose.Schema({
  availability: [
    {
      dayOfWeek: {
        type: Number, // 0 for Sunday, 1 for Monday, ..., 6 for Saturday
        required: true,
      },
      periods: [availabilityPeriodSchema],
    },
  ],
});

const doctorAvailabilitySchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
    },
    hospitalAvailabilities: [hospitalAvailabilitySchema],
    clinicAvailability: clinicAvailabilitySchema,
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

const HospitalAvailability = mongoose.model("HospitalAvailability", hospitalAvailabilitySchema, "hospital availabilities");

module.exports = { DoctorAvailability, HospitalAvailability };
