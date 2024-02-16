const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Joi = require("joi");
const geolib = require("geolib");
const Doctor = require("../../models/Doctor/doctors");
const User = require("../../models/User/user");
const Tests = require("../../models/Laboratory/tests");
const Order = require("../../models/Laboratory/labOrder");
const Rating = require("../../models/rating");

const userLabController = {
  async getNearbyDocs(req, res, next) {
    try {
      const latitude = req.query.lat;
      const longitude = req.query.long;
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

      const doctorIdsWithinRadius = doctorsWithinRadius.map((lab) => lab._id);

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
};

module.exports = userLabController;
