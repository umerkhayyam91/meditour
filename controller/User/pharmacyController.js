const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Pharmacy = require("../../models/Pharmacy/pharmacy");
const Tests = require("../../models/Laboratory/tests");

const userLabController = {
  async getNearbyPharmacies(req, res, next) {
    try {
      const latitude = req.query.lat;
      const longitude = req.query.long;
      const radius = req.query.radius || 1000;
      const pharmacies = await Pharmacy.find({
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

      return res.status(200).json({ pharmacies, auth: true });
    } catch (error) {
      return next(error);
    }
  },
  async filterPharmacies(req, res, next) {
    try {
      const minRating = req.query.minRating;
      const maxRating = req.query.maxRating;

      // Replace these with the actual coordinates and radius or fetch them from the request
      const longitude = req.query.longitude;
      const latitude = req.query.latitude;
      const radius = 10000;

      // Find pharmacies within the specified radius
      const pharmaciesWithinRadius = await Pharmacy.find({
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

      // Get the _id values of pharmacies within the radius
      const pharmacyIdsWithinRadius = pharmaciesWithinRadius.map(
        (pharmacy) => pharmacy._id
      );

      // Find ratings for pharmacies within the radius and meeting the rating criteria
      const pharmacies = await Laboratory.aggregate([
        {
          $match: {
            _id: { $in: pharmacyIdsWithinRadius },
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

      // Check if any pharmacies were found
      if (pharmacies.length === 0) {
        return res
          .status(404)
          .json({
            message: "No pharmacies found with the specified criteria.",
          });
      }
      const pharmaciesWithoutRatings = pharmacies.map(
        ({ ratings, ...rest }) => rest
      );

      // Return the modified response without the 'ratings' array
      return res.status(200).json({ pharmacies: pharmaciesWithoutRatings });

      // Return the found pharmacies
    } catch (error) {
      // Handle errors
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  async getPharmacy(req, res, next) {
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

  //   async getAllTests(req, res, next) {
  //     try {
  //       const page = parseInt(req.query.page) || 1; // Get the page number from the query parameter
  //       const testPerPage = 10;
  //       const labId = req.query.labId;
  //       const totalTests = await Tests.countDocuments({ labId }); // Get the total number of posts for the user
  //       const totalPages = Math.ceil(totalTests / testPerPage); // Calculate the total number of pages

  //       const skip = (page - 1) * testPerPage; // Calculate the number of posts to skip based on the current page
  //       const tests = await Tests.find({ labId }).skip(skip).limit(testPerPage);
  //       let previousPage = page > 1 ? page - 1 : null;
  //       let nextPage = page < totalPages ? page + 1 : null;
  //       // const testDto = new TestDTO(tests);

  //       return res.status(200).json({
  //         tests: tests,
  //         auth: true,
  //         previousPage: previousPage,
  //         nextPage: nextPage,
  //       });
  //     } catch (error) {
  //       return next(error);
  //     }
  //   },
};

module.exports = userLabController;
