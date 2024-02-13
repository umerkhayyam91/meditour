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
      const query = req.query.search;
      const radius = req.query.radius || 1000;
      const page = req.query.page || 1; // Default to page 1
      const limit = req.query.limit || 10; // Default to 10 labs per page

      let pharmacyQuery = {
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
      if (query) {
        const regex = new RegExp(query, "i");
        pharmacyQuery.pharmacyFirstName = regex;
      }

      // Calculate the skip value based on the page and limit
      const skip = (page - 1) * limit;

      // Fetch pharmacies with pagination
      let pharmacies = await Pharmacy.find(pharmacyQuery)
        .skip(skip)
        .limit(limit);

      return res.status(200).json({ pharmacies, auth: true });
    } catch (error) {
      return next(error);
    }
  },
  async filterPharmacies(req, res, next) {
    try {
      const minRating = req.query.minRating;

      // Replace these with the actual coordinates and radius or fetch them from the request
      const longitude = req.query.long;
      const latitude = req.query.lat;
      const radius = req.query.radius || 1000000;

      // Find labs within the specified radius
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

      // Get the _id values of labs within the radius
      const pharmacyIdsWithinRadius = pharmaciesWithinRadius.map(
        (lab) => lab._id
      );

      // Find ratings for labs within the radius and meeting the rating criteria
      const labs = await Pharmacy.aggregate([
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
          $unwind: "$ratings",
        },
        {
          $match: {
            "ratings.rating": {
              $gte: parseFloat(minRating),
            },
          },
        },
      ]);

      // Check if any labs were found
      // if (labs.length === 0) {
      //   return res
      //     .status(404)
      //     .json({ message: "No labs found with the specified criteria." });
      // }
      const pharmaciesWithoutRadius = labs.map(({ ratings, ...rest }) => rest);

      // Return the modified response without the 'ratings' array
      return res.status(200).json({ labs: pharmaciesWithoutRadius });

      // Return the found labs
    } catch (error) {
      // Handle errors
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  async getPharmacy(req, res, next) {
    try {
      const pharmacyId = req.query.pharmacyId;
      const pharmacy = await Pharmacy.findById(pharmacyId);

      if (!pharmacy) {
        const error = new Error("Pharmacy not found!");
        error.status = 404;
        return next(error);
      }
      return res.status(200).json({ pharmacy });
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
