const Doctor = require("../../models/Doctor/doctors");
const Appointment = require("../../models/All Doctors Models/appointment");
const {
  DoctorAvailability,
} = require("../../models/All Doctors Models/availability");
const userLabController = {
  async getNearbyDocs(req, res, next) {
    console.log("challaaaa");
    try {
      const latitude = req.query.lat;
      const longitude = req.query.long;
      console.log("lat......", latitude, longitude);
      const speciality = req.query.speciality;
      const name = req.query.name;
      const radius = req.query.radius || 10000;
      const page = req.query.page || 1; // Default to page 1
      const limit = 5;

      let doctorQuery = {
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

      // Apply search query if provided
      if (speciality) {
        const regex = new RegExp(speciality, "i");
        doctorQuery.speciality = regex;
      }
      if (name) {
        const regex = new RegExp(name, "i");
        doctorQuery.name = regex;
      }

      // Calculate the skip value based on the page and limit
      const skip = (page - 1) * limit;

      // Fetch labs with pagination
      let doctors = await Doctor.find(doctorQuery).skip(skip).limit(limit);

      return res.status(200).json({ doctors, auth: true });
    } catch (error) {
      return next(error);
    }
  },

  async filterDocs(req, res, next) {
    try {
      const minRating = req.query.minRating;
      const longitude = req.query.long;
      const latitude = req.query.lat;
      const radius = req.query.radius || 1000000;
      const page = req.query.page || 1; // Default to page 1
      const limit = req.query.limit || 10; // Default to 10 labs per page

      const doctorsWithinRadius = await Doctor.find({
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

      const doctorIdsWithinRadius = doctorsWithinRadius.map(
        (doctor) => doctor._id
      );
      console.log(doctorIdsWithinRadius);
      console.log(minRating);

      const doctors = await Doctor.find({
        _id: { $in: doctorIdsWithinRadius },
        averageRating: { $gte: parseFloat(minRating) },
      })
        .skip((page - 1) * limit)
        .limit(limit);

      return res.status(200).json({ doctors });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  async getDoc(req, res, next) {
    try {
      const docId = req.query.docId;

      const doctor = await Doctor.findById(docId);

      if (!doctor) {
        const error = new Error("Doctor not found!");
        error.status = 404;
        return next(error);
      }

      return res.status(200).json({ doctor });
    } catch (error) {
      return next(error);
    }
  },

  async getAvailability(req, res, next) {
    try {
      const doctorId = req.query.doctorId;
      // Check if doctor availability exists
      const doctorAvailability = await DoctorAvailability.find({ doctorId });

      if (!doctorAvailability) {
        return res
          .status(404)
          .json({ message: "Doctor availability not found" });
      }

      res.status(200).json({ availability: doctorAvailability });
    } catch (error) {
      next(error);
    }
  },

  async addAppointment(req, res, next) {
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
      const notification = new Notification({
        senderId,
        receiverId,
        title: "MediTour",
        message: `${sender?.name} has sent you an interest`,
      });
      await notification.save();

      sendchatNotification(receiverId, {
        title: "MediTour",
        message: `${sender?.name} has sent you an interest`,
      });

      res.status(201).json({
        appointment: savedAppointment,
        message: "Appointment added successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  async getAppointment(req, res, next) {
    try {
      const appointmentId = req.query.appointmentId;
      // Check if doctor availability exists
      const appointment = await Appointment.findById(appointmentId);

      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }

      res.status(200).json({ appointment });
    } catch (error) {
      next(error);
    }
  },
  async getUpcomingAppointment(req, res, next) {
    try {
      const userId = req.user._id;
      // Check if doctor availability exists
      const latestAppointment = await Appointment.find({ patientId: userId })
        .sort({ createdAt: -1 })
        .limit(1);

      if (!latestAppointment) {
        return res.status(404).json({ message: "No appointment found" });
      }

      res.status(200).json({ latestAppointment });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = userLabController;
