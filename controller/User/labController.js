const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Laboratory = require("../../models/Laboratory/laboratory.js");

const userLabController = {
  async getNearbyLabs(req, res, next) {
    try {
      const latitude = req.query.lat;
      const longitude = req.query.long;
      const radius = req.query.radius || 1000;
      const labs = await Laboratory.find({
        loc: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude], // Replace with the desired coordinates
            },
            $maxDistance: radius, // 1 km radius
          },
        },
      });

      return res.status(200).json({ labs, auth: true });
    } catch (error) {
      return next(error);
    }
  },
  async filterLabs(req, res, next) {
    try {
      const minRating = req.body.minRating;
      const maxRating = req.body.maxRating;
      const labs = await Laboratory.find({
        rating: { $gte: minRating, $lte: maxRating },
        loc: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude], // Replace with the desired coordinates
            },
            $maxDistance: radius, // 1 km radius
          },
        },
      });
    } catch (error) {}
  },

  async getLab(req, res, next) {
    try {
      const labId = req.query.labId;
      const lab = await Laboratory.findById(labId);

      if (!lab) {
        const error = new Error("Laboratory not found!");
        error.status = 404;
        return next(error);
      }
      return res.status(200).json({ lab });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = userLabController;
