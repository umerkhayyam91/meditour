const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Joi = require("joi");
const Pharmacy = require("../../models/Pharmacy/pharmacy");
const PharmacyOrder = require("../../models/Pharmacy/pharmOrder");
const PharmacyCart = require("../../models/User/cart");
const geolib = require("geolib");
const Medicine = require("../../models/Pharmacy/medicine");
const User = require("../../models/User/user");

async function getNextOrderNo() {
  // Find the latest lab order in the database and get its orderId
  const latestLabOrder = await PharmacyOrder.findOne({}, 'orderId').sort({ orderId: -1 });

  // If there are no lab orders yet, start with "LAB0001"
  const nextOrderIdNumber = latestLabOrder
    ? Number(latestLabOrder.orderId.substring(3)) + 1
    : 1;

  const nextOrderId = `LAB${nextOrderIdNumber.toString().padStart(4, '0')}`;

  return nextOrderId;
}


const userPharmacyController = {
  async getNearbyPharmacies(req, res, next) {
    try {
      const latitude = req.query.lat;
      const longitude = req.query.long;
      const query = req.query.search;
      const radius = req.query.radius || 10000;
      const page = req.query.page || 1; // Default to page 1
      const limit = 10; // Default to 10 pharmacies per page

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
      const longitude = req.query.long;
      const latitude = req.query.lat;
      const radius = req.query.radius || 1000000;
      const page = req.query.page || 1; // Default to page 1
      const limit = req.query.limit || 10; // Default to 10 labs per page

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

      const pharmacyIdsWithinRadius = pharmaciesWithinRadius.map(
        (pharmacy) => pharmacy._id
      );

      const pharmacies = await Pharmacy.find({
        _id: { $in: pharmacyIdsWithinRadius },
        averageRating: { $gte: parseFloat(minRating) },
      })
        .skip((page - 1) * limit)
        .limit(limit);

      return res.status(200).json({ pharmacies });
    } catch (error) {
      return next(error);
    }
  },

  async getPharmacy(req, res, next) {
    try {
      const pharmacyId = req.query.pharmacyId;
      const userLatitude = req.query.lat;
      const userLongitude = req.query.long;
      const pharmacy = await Pharmacy.findById(pharmacyId);

      if (!pharmacy) {
        const error = new Error("Pharmacy not found!");
        error.status = 404;
        return next(error);
      }
      const pharmacyCoordinates = {
        latitude: pharmacy.loc[1],
        longitude: pharmacy.loc[0],
      };
      const distance = geolib.getDistance(
        { latitude: userLatitude, longitude: userLongitude },
        pharmacyCoordinates
      );

      return res.status(200).json({ pharmacy, distance });
    } catch (error) {
      return next(error);
    }
  },

  async addToCart(req, res, next) {
    try {
      const userId = req.user._id; // Replace with your authentication logic to get the user ID
      const medicineIdToAdd = req.body.medicineId;
      const quantityToAdd = req.body.quantity || 1; // Default quantity is 1 if not specified

      // Use findOneAndUpdate to add the medicine to the cart
      const updatedCart = await PharmacyCart.findOneAndUpdate(
        { userId },
        {
          $addToSet: {
            cartItems: { medicineId: medicineIdToAdd, quantity: quantityToAdd },
          },
        },
        { upsert: true, new: true }
      );

      // Return the updated cart as a response
      return res.status(200).json({ cart: updatedCart });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
  async getCart(req, res, next) {
    try {
      const userId = req.user._id; // Replace with your authentication logic to get the user ID
      const cart = await PharmacyCart.findOne({ userId });
      if (!cart) {
        const error = new Error("Cart not found!");
        error.status = 404;
        return next(error);
      }

      // Return the updated cart as a response
      return res.status(200).json({ cart, auth: true });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  async getAllMeds(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1; // Get the page number from the query parameter
      const medPerPage = 5;
      const pharmId = req.query.pharmId;
      const totalMeds = await Medicine.countDocuments({ pharmId }); // Get the total number of posts for the user
      const totalPages = Math.ceil(totalMeds / medPerPage); // Calculate the total number of pages

      const skip = (page - 1) * medPerPage; // Calculate the number of posts to skip based on the current page

      const medicines = await Medicine.find({ pharmId })
        .skip(skip)
        .limit(medPerPage);
      let previousPage = page > 1 ? page - 1 : null;
      let nextPage = page < totalPages ? page + 1 : null;
      // const medDto = new medDTO(medicines);
      return res.status(200).json({
        medicines: medicines,
        auth: true,
        totalMeds,
        previousPage: previousPage,
        nextPage: nextPage,
      });
    } catch (error) {
      return next(error);
    }
  },

  async addPharmacyOrder(req, res, next) {
    try {
      const orderSchema = Joi.object({
        pharmId: Joi.string().required(),
        medicines: Joi.array().required(),
        preference: Joi.string().valid("labVisit", "homeSample").required(),
        currentLocation: Joi.string().required(),
        prescription: Joi.string(),
        customerName: Joi.string().required(),
        MR_NO: Joi.string().required(),
        totalAmount: Joi.number().required(),
      });
      // Validate the request body
      const { error } = orderSchema.validate(req.body);
      if (error) {
        return next(error);
      }
      const userId = req.user._id;
      const {
        pharmId,
        medicines,
        preference,
        currentLocation,
        prescription,
        customerName,
        MR_NO,
        totalAmount,
      } = req.body;
      const orderId = await getNextOrderNo();
      let order;
      try {
        const orderToRegister = new PharmacyOrder({
          orderId,
          userId,
          pharmId,
          medicines,
          preference,
          currentLocation,
          prescription,
          customerName,
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

  async addRemoveFavPharmacy(req, res, next) {
    try {
      const pharmacyId = req.query.pharmacyId;
      const userId = req.user._id;

      const pharmacy = await Pharmacy.findById(pharmacyId);
      if (!pharmacy) {
        const error = new Error("Pharmacy not found!");
        error.status = 404;
        return next(error);
      }

      const user = await User.findById(userId);
      if (!user) {
        const error = new Error("User not found!");
        error.status = 404;
        return next(error);
      }

      const alreadyExistsIndex = user.favouritePharmacies.indexOf(pharmacyId);

      if (alreadyExistsIndex !== -1) {
        // If PharmacyID is found in the favourites array, remove it using the pull operator
        user.favouritePharmacies.pull(pharmacyId);
      } else {
        // If labId is not found, add it to the favourites array
        user.favouritePharmacies.push(pharmacyId);
      }

      // Save the updated user document
      await user.save();

      return res.status(200).json({ user });
    } catch (error) {
      return next(error);
    }
  },
  async getAllFavPharmacies(req, res, next) {
    try {
      const userId = req.user._id;

      const user = await User.findOne({ _id: userId }).populate(
        "favouritePharmacies"
      );
      // console.log(user);
      if (!user) {
        const error = new Error("User not found!");
        error.status = 404;
        return next(error);
      }
      const favourites = user.favouritePharmacies;
      // Save the updated user document
      await user.save();

      return res.status(200).json({ favouritePharmacies: favourites });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = userPharmacyController;
