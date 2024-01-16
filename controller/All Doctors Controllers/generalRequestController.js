const express = require("express");
const app = express();
const Availability = require("../../models/All Doctors Models/availability");
const AppointmentRequest = require("../../models/All Doctors Models/request");
const Appointment = require("../../models/All Doctors Models/appointment");

const docRequestController = {
  async getRequests(req, res, next) {
    try {
      const doctorId = req.user._id;
      const allRequests = await AppointmentRequest.find({ doctorId , status: "pending"});
      return res.status(200).json({
        AppointmentRequests: allRequests,
        auth: true,
      });
    } catch (error) {
      res.status(500).json({
        status: "Failure",
        error: error.message,
      });
    }
  },

  async acceptRequest(req, res, next) {
    try {
      const bookingId = req.query.bookingId;
      const doctorId = req.user._id;
      const booking = await AppointmentRequest.findById(bookingId);
      if (!booking) {
        const error = new Error("Appointment request not found!");
        error.status = 404;
        return next(error);
      }
      if(booking.status=="accept"){
        return res.status(200).json({
          auth: false,
          message: "Booking already accepted",
        });
      }
      booking.status = "accept";
      const patientId = booking.patientId;
      const appointmentType = booking.appointmentType;
      await booking.save();
      const newAppointment = new Appointment({
        doctorId,
        patientId,
        date: Date.now(),
        startTime: booking.requestedDateTime,
        appointmentType,
        status: "pending",
      });
      // console.log(doctorId)
      // Save the new appointment to the database
      await newAppointment.save();
      return res.status(200).json({
        auth: true,
        message: "Booking Accepted successfully",
      });
    } catch (error) {
      return next(error);
    }
  },

  async rejectRequest(req, res, next) {
    try {
      const bookingId = req.query.bookingId;
      const booking = await AppointmentRequest.findById(bookingId);
      if (!booking) {
        const error = new Error("Appointment request not found!");
        error.status = 404;
        return next(error);
      }
      await AppointmentRequest.findByIdAndDelete(bookingId);
      return res.status(200).json({
        auth: true,
        message: "Booking rejected successfully",
      });
    } catch (error) {
      return next(error);
    }
  },


};

module.exports = docRequestController;
