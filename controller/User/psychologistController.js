const Psychologist = require("../../models/Psychologist/psychologist");
const {
  DoctorAvailability,
} = require("../../models/All Doctors Models/availability");
const Appointment = require("../../models/All Doctors Models/appointment");
const Rating = require("../../models/rating");

const psychologistController = {
  async getNearbyPsychologists(req, res, next) {
    try {
      const latitude = req.query.lat;
      const longitude = req.query.long;
      const radius = req.query.radius || 10000;
      const name = req.query.name;
      const page = req.query.page || 1;
      const limit = 5;

      let psychologistQuery = {
        loc: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
            $maxDistance: radius,
          },
        },
      };
      if (name) {
        const regex = new RegExp(name, "i");
        psychologistQuery.name = regex;
      }
      //skip
      const skip = (page - 1) * limit;
      let psychologists = await Psychologist.find(psychologistQuery)
        .skip(skip)
        .limit(limit);
      return res.status(200).json({ psychologists, auth: true });
    } catch (error) {
      return next(error);
    }
  },
  async filterPsychologist(req, res, next) {
    try {
      const minRating = req.query.minRating;
      const longitude = req.query.long;
      const latitude = req.query.lat;
      const radius = req.query.radius || 1000000;
      const page = req.query.page || 1; // Default to page 1
      const limit = req.query.limit || 10; // Default to 10 labs per page

      const psychologistsWithinRadius = await Psychologist.find({
        loc: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
            $maxDistance: radius,
          },
        },
      });
      const psychologistIdsWithinRadius = psychologistsWithinRadius.map(
        (doctor) => doctor._id
      );
      //   console.log(psychologistIdsWithinRadius);
      //   console.log(minRating);

      const Psychologists = await Psychologist.find({
        _id: { $in: psychologistIdsWithinRadius },
        averageRating: { $gte: parseFloat(minRating) },
      })
        .skip((page - 1) * limit)
        .limit(limit);

      return res.status(200).json({ Psychologists });
    } catch (error) {
      return next(error);
    }
  },

  async getPsychologist(req, res, next) {
    try {
      const psychologistId = req.query.psychologistId;

      const psychologist = await Psychologist.findById(psychologistId);

      if (!psychologist) {
        const error = new Error("Psychologist not found!");
        error.status = 404;
        return next(error);
      }

      return res.status(200).json({ psychologist });
    } catch (error) {
      return next(error);
    }
  },

  async getPsychoAvailability(req, res, next) {
    try {
      const doctorId = req.query.doctorId;
      // Check if doctor availability exists
      const psychoAvailability = await DoctorAvailability.find({ doctorId });

      if (!psychoAvailability) {
        return res
          .status(404)
          .json({ message: "Psychologist availability not found" });
      }

      res.status(200).json({ availability: psychoAvailability });
    } catch (error) {
      return next(error);
    }
  },

  async addPsyAppointment(req, res, next) {
    try {
      const { date, startTime, endTime, appointmentType } = req.body;
      const doctorId = req.query.doctorId;
      const patientId = req.user._id;

      // Create a new appointment
      const newAppointment = new Appointment({
        doctorId,
        patientId,
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
      return next(error);
    }
  },
};
module.exports = psychologistController;
