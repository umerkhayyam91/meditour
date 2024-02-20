const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Joi = require("joi");
const geolib = require("geolib");
const Laboratory = require("../../models/Laboratory/laboratory");
const User = require("../../models/User/user");
const Tests = require("../../models/Laboratory/tests");
const Order = require("../../models/Laboratory/labOrder");
const Rating = require("../../models/rating");

async function getNextOrderNo() {
  // Find the latest lab order in the database and get its orderId
  const latestLabOrder = await Order.findOne({}, "orderId").sort({
    orderId: -1,
  });

  // If there are no lab orders yet, start with "PHARM0001"
  const nextOrderIdNumber = latestLabOrder
    ? parseInt(latestLabOrder.orderId.substring(5)) + 1
    : 1;

  const nextOrderId = `PHARM${nextOrderIdNumber.toString().padStart(4, "0")}`;

  return nextOrderId;
}

const userLabController = {
  async getNearbyLabs(req, res, next) {
    try {
      const latitude = req.query.lat;
      const longitude = req.query.long;
      const query = req.query.search;
      const radius = req.query.radius || 10000;
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

      const labs = await Laboratory.find({
        _id: { $in: labIdsWithinRadius },
        averageRating: { $gte: parseFloat(minRating) },
      })
        .skip((page - 1) * limit)
        .limit(limit);

      return res.status(200).json({ labs });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  async getLab(req, res, next) {
    try {
      const labId = req.query.labId;
      const userLatitude = req.query.lat;
      const userLongitude = req.query.long;

      const lab = await Laboratory.findById(labId);

      if (!lab) {
        const error = new Error("Laboratory not found!");
        error.status = 404;
        return next(error);
      }
      // Calculate the distance between user and lab using Haversine formula
      const labCoordinates = {
        latitude: lab.loc[1],
        longitude: lab.loc[0],
      };

      const distance = geolib.getDistance(
        { latitude: userLatitude, longitude: userLongitude },
        labCoordinates
      );

      // Distance will be in meters, you can convert it to other units if needed

      return res.status(200).json({ lab, distance });
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

  async addLabOrder(req, res, next) {
    try {
      const orderSchema = Joi.object({
        labId: Joi.string().required(),
        tests: Joi.array().required(),
        preference: Joi.string().valid("labVisit", "homeSample").required(),
        currentLocation: Joi.string().allow(''),
        prescription: Joi.string().allow(''),
        patientName: Joi.string().required(),
        MR_NO: Joi.string().required(),
        totalAmount: Joi.string().required(),
      });
      // Validate the request body
      const { error } = orderSchema.validate(req.body);
      if (error) {
        return next(error);
      }
      const userId = req.user._id;
      const {
        labId,
        tests,
        preference,
        currentLocation,
        prescription,
        patientName,
        MR_NO,
        totalAmount,
      } = req.body;
      const orderId = await getNextOrderNo();
      let order;
      try {
        const orderToRegister = new Order({
          labId,
          userId,
          tests,
          orderId,
          preference,
          currentLocation,
          prescription,
          patientName,
          MR_NO,
          totalAmount,
        });

        order = await orderToRegister.save();
      } catch (error) {
        return next(error);
      }

      return res.status(201).json(order);
    } catch (error) {
      return next(error);
    }
  },

  async addRatingReview(req, res, next) {
    try {
      const { rating, review } = req.body;
      const vendorId = req.query.vendorId;
      const userId = req.user._id;
      const user = await User.findById(userId);
      console.log(user);

      // Check if the user has already given a review for this vendor
      const existingUserReview = await Rating.findOne({
        vendorId,
        "ratings.userId": userId,
      });

      if (existingUserReview) {
        return res
          .status(400)
          .json({ message: "User has already given a review for this vendor" });
      }

      // Check if the vendorId exists in the ratings collection
      let existingRating = await Rating.findOne({ vendorId });

      // If the vendorId doesn't exist, create a new entry
      if (!existingRating) {
        existingRating = new Rating({
          vendorId,
          ratings: [],
        });
      }

      // Add the new rating to the existingRating or the newly created rating
      existingRating.ratings.push({
        userId,
        rating,
        review,
        userImage: user.userImage,
        userName: user.name,
      });

      // Save the updated rating to the database
      await existingRating.save();

      res.status(201).json({ message: "Review added successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  async getAllRatingReviews(req, res, next) {
    try {
      const vendorId = req.query.vendorId;
      let existingRating = await Rating.findOne({ vendorId });

      res.status(201).json({ existingRating, auth: true });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = userLabController;
