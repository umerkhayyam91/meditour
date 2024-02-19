const Hospital = require("../../models/Hospital/hospital");
const Doctor = require("../../models/Doctor/doctors");
const Department = require("../../models/Hospital/department");
const Appointment = require("../../models/All Doctors Models/appointment");
const {
  DoctorAvailability,
} = require("../../models/All Doctors Models/availability");

const userLabController = {
  async getNearbyHospitals(req, res, next) {
    try {
      const latitude = req.query.lat;
      const longitude = req.query.long;
      const hospitalName = req.query.hospitalName;
      const radius = req.query.radius || 10000;
      const page = req.query.page || 1; // Default to page 1
      const limit = 5;

      let hospitalQuery = {
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
      if (hospitalName) {
        const regex = new RegExp(hospitalName, "i");
        hospitalQuery.hospitalName = regex;
      }

      // Calculate the skip value based on the page and limit
      const skip = (page - 1) * limit;

      // Fetch labs with pagination
      let hospitals = await Hospital.find(hospitalQuery).skip(skip).limit(limit);

      return res.status(200).json({ hospitals, auth: true });
    } catch (error) {
      return next(error);
    }
  },

  async filterHospitals(req, res, next) {
    try {
      const minRating = req.query.minRating;
      const longitude = req.query.long;
      const latitude = req.query.lat;
      const radius = req.query.radius || 1000000;
      const page = req.query.page || 1; // Default to page 1
      const limit = req.query.limit || 10; // Default to 10 labs per page

      const hospitalsWithinRadius = await Hospital.find({
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

      const hospitalIdsWithinRadius = hospitalsWithinRadius.map(
        (hospital) => hospital._id
      );

      const hospitals = await Hospital.find({
        _id: { $in: hospitalIdsWithinRadius },
        averageRating: { $gte: parseFloat(minRating) },
      })
        .skip((page - 1) * limit)
        .limit(limit);

      return res.status(200).json({ hospitals });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  async getHospital(req, res, next) {
    try {
      const hospitalId = req.query.hospitalId;

      const hospital = await Hospital.findById(hospitalId);

      if (!hospital) {
        const error = new Error("Hospital not found!");
        error.status = 404;
        return next(error);
      }

      return res.status(200).json({ hospital });
    } catch (error) {
      return next(error);
    }
  },

  async getHospitalDocs(req, res, next) {
    try {
      const hospitalId = req.query.hospitalId;

      const doctors = await Doctor.find({
        hospitalIds: {$in: [hospitalId]}
      });

      return res.status(200).json({ doctors });
    } catch (error) {
      return next(error);
    }
  },

  async getAllDepartments(req, res, next) {
    try {
      const hospitalId = req.query.hospitalId;

      const departments = await Department.find({
        hospitalId
      });

      return res.status(200).json({ departments });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = userLabController;
