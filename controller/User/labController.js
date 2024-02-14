const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Laboratory = require("../../models/Laboratory/laboratory");
const User = require("../../models/User/user");
const Tests = require("../../models/Laboratory/tests");
const Order = require("../../models/Laboratory/labOrder");

const userLabController = {
  async getNearbyLabs(req, res, next) {
    try {
      const latitude = req.query.lat;
      const longitude = req.query.long;
      const query = req.query.search;
      const radius = req.query.radius || 1000;
      const page = req.query.page || 1; // Default to page 1
      const limit = 10; // Default to 10 labs per page
  
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
      let labs = await Laboratory.find(labsQuery).skip(skip).limit(limit);
  
      // Fetch ratings for each lab using $lookup
      labs = await Laboratory.aggregate([
        { $match: { _id: { $in: labs.map(lab => lab._id) } } },
        {
          $lookup: {
            from: "ratings", // Replace with the actual name of your ratings collection
            localField: "_id",
            foreignField: "vendorId",
            as: "ratings",
          },
        },
      ]);
  
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
      aggregatePipeline.push({ $skip: skip }, { $limit: limit });

      const labs = await Laboratory.aggregate(aggregatePipeline);
      // const labsWithoutRatings = labs.map(({ ratings, ...rest }) => rest);

      return res.status(200).json({ labs });
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

  async addRemoveFav(req, res, next) {
    try {
      const labId = req.query.labId;
      const userId = req.user._id;

      const laboratory = await Laboratory.findById(labId);
      if (!laboratory) {
        const error = new Error("Laboratory not found!");
        error.status = 404;
        return next(error);
      }

      const user = await User.findById(userId);
      if (!user) {
        const error = new Error("User not found!");
        error.status = 404;
        return next(error);
      }

      const alreadyExistsIndex = user.favouriteLabs.indexOf(labId);

      if (alreadyExistsIndex !== -1) {
        // If labId is found in the favourites array, remove it using the pull operator
        user.favouriteLabs.pull(labId);
      } else {
        // If labId is not found, add it to the favourites array
        user.favouriteLabs.push(labId);
      }

      // Save the updated user document
      await user.save();

      return res.status(200).json({ user });
    } catch (error) {
      return next(error);
    }
  },

  async getAllFav(req, res, next) {
    try {
      const userId = req.user._id;

      const user = await User.findOne({ _id: userId }).populate(
        "favouriteLabs"
      );
      // console.log(user);
      if (!user) {
        const error = new Error("User not found!");
        error.status = 404;
        return next(error);
      }
      const favourites = user.favouriteLabs;
      // Save the updated user document
      await user.save();

      return res.status(200).json({ favouriteLabs: favourites });
    } catch (error) {
      return next(error);
    }
  },

  async addOrder(req, res, next) {
    try {
      const orderSchema = Joi.object({
        labId: Joi.string().required(),
        // userId: Joi.string().required(),
        testIds: Joi.array().required(),
        orderId: Joi.string().required(),
        testCode: Joi.string().required(),
        testName: Joi.string().required(),
        preference: Joi.string().valid("labVisit", "homeSample").required(),
        currentLocation: Joi.string().required(),
        prescription: Joi.string(),
        patientName: Joi.string().required(),
        MR_NO: Joi.string().required(),
        status: Joi.string().valid("pending", "inProcess", "completed"),
        results: Joi.string(),
      });
      // Validate the request body
      const { error } = orderSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      // Create a new LabOrder document
      const newOrder = new LabOrder(req.body);

      // Save the order to the database
      const savedOrder = await newOrder.save();

      return res.status(201).json(savedOrder);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = userLabController;
