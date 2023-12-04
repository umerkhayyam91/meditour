const mongoose = require('mongoose');

const appointmentRequestSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  requestedDateTime: {
    type: String,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
});

const AppointmentRequest = mongoose.model('AppointmentRequest', appointmentRequestSchema, 'appointmentRequests');

module.exports = AppointmentRequest;
