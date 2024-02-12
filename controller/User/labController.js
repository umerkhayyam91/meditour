const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Laboratory = require("../../models/Laboratory/laboratory");
const Tests = require("../../models/Laboratory/tests");

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
      const minRating = req.query.minRating;
      const maxRating = req.query.maxRating;

      // Replace these with the actual coordinates and radius or fetch them from the request
      const longitude = req.query.long;
      const latitude = req.query.lat;
      console.log(minRating);
      console.log(maxRating);
      console.log(longitude);
      console.log(latitude);
      const radius = req.query.radius || 1000000;

      // Find labs within the specified radius
      const labsWithinRadius = await Laboratory.find({
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

      // Get the _id values of labs within the radius
      const labIdsWithinRadius = labsWithinRadius.map((lab) => lab._id);

      // Find ratings for labs within the radius and meeting the rating criteria
      const labs = await Laboratory.aggregate([
        {
          $match: {
            _id: { $in: labIdsWithinRadius },
          },
        },
        {
          $lookup: {
            from: "ratings",
            localField: "_id",
            foreignField: "vendorId",
            as: "ratings",
          },
        },
        {
          $match: {
            "ratings.rating": {
              $gte: minRating,
              $lte: maxRating,
            },
          },
        },
      ]);

      // Check if any labs were found
      if (labs.length === 0) {
        return res
          .status(404)
          .json({ message: "No labs found with the specified criteria." });
      }
      const labsWithoutRatings = labs.map(({ ratings, ...rest }) => rest);

      // Return the modified response without the 'ratings' array
      return res.status(200).json({ labs: labsWithoutRatings });

      // Return the found labs
    } catch (error) {
      // Handle errors
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
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

  async getAllTests(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1; // Get the page number from the query parameter
      const testPerPage = 10;
      const labId = req.query.labId;
      const totalTests = await Tests.countDocuments({ labId }); // Get the total number of posts for the user
      const totalPages = Math.ceil(totalTests / testPerPage); // Calculate the total number of pages

      const skip = (page - 1) * testPerPage; // Calculate the number of posts to skip based on the current page
      const tests = await Tests.find({ labId }).skip(skip).limit(testPerPage);
      let previousPage = page > 1 ? page - 1 : null;
      let nextPage = page < totalPages ? page + 1 : null;
      // const testDto = new TestDTO(tests);

      return res.status(200).json({
        tests: tests,
        auth: true,
        previousPage: previousPage,
        nextPage: nextPage,
      });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = userLabController;
