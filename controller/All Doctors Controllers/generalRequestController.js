const express = require("express");
const app = express();
const Availability = require("../../models/All Doctors Models/availability");
const AppointmentRequest = require("../../models/All Doctors Models/request");
const Appointment = require("../../models/All Doctors Models/appointment");
const History = require("../../models/All Doctors Models/history");
const Prescription = require("../../models/All Doctors Models/ePrescription");
const Referral = require("../../models/All Doctors Models/referral");
const Doctor = require("../../models/Doctor/doctors");

const docRequestController = {
  async getRequests(req, res, next) {
    try {
      const doctorId = req.user._id;
      const allRequests = await AppointmentRequest.find({
        doctorId,
        status: "pending",
      });
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
      if (booking.status == "accept") {
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

  async addHistory(req, res, next) {
    try {
      const appointmentId = req.query.appointmentId;
      const patientId = req.query.patientId;
      const doctorId = req.user._id;
      const { symptoms, description } = req.body;
      const newHistory = new History({
        doctorId,
        patientId,
        symptoms,
        description,
      });

      const savedHistory = await newHistory.save();

      await Appointment.findByIdAndUpdate(
        appointmentId,
        { $set: { history: savedHistory._id } },
        { new: true }
      );

      res.status(201).json({
        message: "History added to the appointment successfully",
        history: savedHistory,
      });
    } catch (error) {
      return next(error);
    }
  },

  async addPrescription(req, res, next) {
    try {
      const appointmentId = req.query.appointmentId;
      const patientId = req.query.patientId;
      const doctorId = req.user._id;
      const { medicines, test } = req.body;
      const prescription = new Prescription({
        doctorId,
        patientId,
        medicines,
        test,
      });

      const savedPrescription = await prescription.save();

      await Appointment.findByIdAndUpdate(
        appointmentId,
        { $set: { ePrescription: savedPrescription._id } },
        { new: true }
      );

      res.status(201).json({
        message: "History added to the appointment successfully",
        prescription: savedPrescription,
      });
    } catch (error) {
      return next(error);
    }
  },

  async searchDoctor(req, res, next) {
    try {
      const query = req.query.name;
      const regex = new RegExp(query, "i");

      const doctors = await Doctor.find({ name: regex });
      res.json({ doctors, auth: true });
    } catch (error) {
      return next(error);
    }
  },

  async referDoctor(req, res, next) {
    try {
      const additionalInfo = req.body.additionalInfo;
      const referringDoctorId = req.user._id;
      const referredDoctorId = req.query.referredDoctorId;
      const patientId = req.query.patientId;
      // Create a new referral
      const referral = new Referral({
        referringDoctorId,
        referredDoctorId,
        patientId,
        additionalInfo,
      });

      // Save the referral to the database
      const savedReferral = await referral.save();

      res.status(201).json(savedReferral);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = docRequestController;
