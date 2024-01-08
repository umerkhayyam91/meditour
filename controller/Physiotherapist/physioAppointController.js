const express = require("express");
const app = express();
const Appointment = require("../../models/All Doctors Models/appointment");
const Patient = require("../../models/user");
const User = require("../../models/user");
const AppointmentRequest = require("../../models/All Doctors Models/request");

const physioAppointController = {
  async getAllAppointments(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1; // Get the page number from the query parameter
      const appointPerPage = 10;
      const doctorId = req.user._id;
      const totalAppoints = await Appointment.countDocuments({ doctorId }); // Get the total number of posts for the user
      const totalPages = Math.ceil(totalAppoints / appointPerPage); // Calculate the total number of pages

      const skip = (page - 1) * appointPerPage; // Calculate the number of posts to skip based on the current page

      const allAppointments = await Appointment.find({ doctorId })
        .skip(skip)
        .limit(appointPerPage);
      let previousPage = page > 1 ? page - 1 : null;
      let nextPage = page < totalPages ? page + 1 : null;
      return res.status(200).json({
        Appointments: allAppointments,
        auth: true,
        previousPage: previousPage,
        nextPage: nextPage,
      });
    } catch (error) {
      res.status(500).json({
        status: "Failure",
        error: error.message,
      });
    }
  },

  async getAllPatients(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1; // Get the page number from the query parameter
      const patientPerPage = 10;
      const doctorId = req.user._id;
      const allAppointments = await Appointment.find({
        doctorId,
        status: "completed",
      });
      const patientsSet = new Set(
        allAppointments.map((appoint) => appoint.patientId)
      );
      const uniquePatients = Array.from(patientsSet);
      const totalPatients = uniquePatients.length;
      const totalPages = Math.ceil(totalPatients / patientPerPage); // Calculate the total number of pages

      const skip = (page - 1) * patientPerPage; // Calculate the number of posts to skip based on the current page

      const patients = await User.find({ _id: { $in: uniquePatients } })
        .skip(skip)
        .limit(patientPerPage);
      let previousPage = page > 1 ? page - 1 : null;
      let nextPage = page < totalPages ? page + 1 : null;
      return res.status(200).json({
        Patients: patients,
        auth: true,
        previousPage: previousPage,
        nextPage: nextPage,
      });
    } catch (error) {
      res.status(500).json({
        status: "Failure",
        error: error.message,
      });
    }
  },

  async patientHistory(req, res, next) {
    try {
      const patientId = req.query.id;
      const doctorId = req.user._id;
      const patient = await Patient.findById(patientId);
      if (!patient) {
        const error = new Error("Patient not found!");
        error.status = 400;
        return next(error);
      }
      // console.log(patientId);
      // console.log(doctorId);
      const allAppointments = await Appointment.find({
        doctorId,
        patientId,
        status: "completed",
      });
      return res.status(200).json({
        patient,
        Appointments: allAppointments,
        auth: true,
      });
    } catch (error) {
      res.status(500).json({
        status: "Failure",
        error: error.message,
      });
    }
  },

  async getRequests(req, res, next) {
    try {
      const doctorId = req.user._id;
      const allRequests = await AppointmentRequest.find({ doctorId });
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

  async addAppoints(req, res, next) {
    try {
      const { date, startTime, endTime, appointmentType } = req.body;
      const doctorId = req.user._id;

      // Create a new appointment
      const newAppointment = new Appointment({
        doctorId,
        patientId: "6575c60302fd4a563391b8b0",
        date,
        startTime,
        endTime,
        appointmentType,
      });

      // Save the new appointment to the database
      const savedAppointment = await newAppointment.save();

      res.status(201).json({
        appointment: savedAppointment,
        message: "Appointment added successfully",
      });
    } catch (error) {
      next(error);
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
          message: "Booking Accepted already accepted",
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

  async addAppoints(req, res, next) {
    try {
      const doctorId = req.user._id;
      // Create a new appointment
      const newAppointment = new AppointmentRequest({
        doctorId,
        patientId: "656867ce85953ba14f2c9ff8",
        status: "approved",
        requestedDateTime: "10 am",
      });
      // console.log(doctorId)
      // Save the new appointment to the database
      const savedAppointment = await newAppointment.save();

      res.status(201).json({
        appointment: savedAppointment,
        message: "Appointment added successfully",
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = physioAppointController;
