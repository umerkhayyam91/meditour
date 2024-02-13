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
      const query = req.query.search;
      const radius = req.query.radius || 1000;
      const page = req.query.page || 1; // Default to page 1
      const limit = req.query.limit || 10; // Default to 10 labs per page
  
      let labsQuery = {
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
        labsQuery.labFirstName = regex;
      }
  
      // Calculate the skip value based on the page and limit
      const skip = (page - 1) * limit;
  
      // Fetch labs with pagination
      let labs = await Laboratory.find(labsQuery)
        .skip(skip)
        .limit(limit);
  
      return res.status(200).json({ labs, auth: true });
    } catch (error) {
      return next(error);
    }
  },

  async filterLabs(req, res, next) {
    try {
      const minRating = req.query.minRating;
      const longitude = req.query.long;
      const latitude = req.query.lat;
      const radius = req.query.radius || 1000000;
      const page = req.query.page || 1; // Default to page 1
      const limit = req.query.limit || 10; // Default to 10 labs per page
  
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
  
      const labIdsWithinRadius = labsWithinRadius.map((lab) => lab._id);
  
      const aggregatePipeline = [
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
          $unwind: "$ratings",
        },
        {
          $match: {
            "ratings.rating": {
              $gte: parseFloat(minRating),
            },
          },
        },
      ];
  
      // Calculate the skip value based on the page and limit
      const skip = (page - 1) * limit;
  
      // Apply pagination to the aggregation pipeline
      aggregatePipeline.push(
        { $skip: skip },
        { $limit: limit }
      );
  
      const labs = await Laboratory.aggregate(aggregatePipeline);
      const labsWithoutRatings = labs.map(({ ratings, ...rest }) => rest);
  
      return res.status(200).json({ labs: labsWithoutRatings });
  
    } catch (error) {
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
      const categoryName = req.query.categoryName;
      const totalTests = await Tests.countDocuments({ labId, categoryName }); // Get the total number of posts for the user
      const totalPages = Math.ceil(totalTests / testPerPage); // Calculate the total number of pages

      const skip = (page - 1) * testPerPage; // Calculate the number of posts to skip based on the current page
      const tests = await Tests.find({ labId, categoryName })
        .skip(skip)
        .limit(testPerPage);
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
