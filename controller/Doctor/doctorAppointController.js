const express = require("express");
const app = express();
const Appointment = require("../../models/Doctor/appointment");
const Patient = require("../../models/user")
const User = require("../../models/user")

const docAppointController = {
  async getAllAppointments(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1; // Get the page number from the query parameter
      const appointPerPage = 10;
      const doctorId = req.user.id;
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

  async getAllPatients(req,res,next){
    try {
      const page = parseInt(req.query.page) || 1; // Get the page number from the query parameter
      const patientPerPage = 10;
      const doctorId = req.user._id;
      const allAppointments = await Appointment.find({ doctorId })
      const patientsSet = new Set(allAppointments.map(appoint => appoint.patientId));
      const uniquePatients = Array.from(patientsSet);
      const totalPatients = uniquePatients.length; 
      const totalPages = Math.ceil(totalPatients / patientPerPage); // Calculate the total number of pages

      const skip = (page - 1) * patientPerPage; // Calculate the number of posts to skip based on the current page

        const patients = await User.find({ _id: { $in: uniquePatients } }).skip(skip)
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

//   async addAppoints(req, res, next) {
//     try {
//       const { date, startTime, endTime } = req.body;
//       const doctorId = req.user._id;

//       // Create a new appointment
//       const newAppointment = new Appointment({
//         doctorId,
//         patientId: "656867ce85953ba14f2c9ff8",
//         date,
//         startTime,
//         endTime,
//       });

//       // Save the new appointment to the database
//       const savedAppointment = await newAppointment.save();

//       res
//         .status(201)
//         .json({
//           appointment: savedAppointment,
//           message: "Appointment added successfully",
//         });
//     } catch (error) {
//       next(error);
//     }
//   },
};

module.exports = docAppointController;