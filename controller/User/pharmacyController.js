const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Pharmacy = require("../../models/Pharmacy/pharmacy");
const PharmacyCart = require("../../models/User/cart");
const geolib= require("geolib");
const Tests = require("../../models/Laboratory/tests");

const userLabController = {
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
      const userLatitude= req.query.lat;
      const userLongitude=req.query.long;
      const pharmacy = await Pharmacy.findById(pharmacyId);

      if (!pharmacy) {
        const error = new Error("Pharmacy not found!");
        error.status = 404;
        return next(error);
      }
      const pharmacyCoordinates={
  latitude: pharmacy.loc[1],
  longitude:pharmacy.loc[0],

      };
      const distance = geolib.getDistance(
        {latitude:userLatitude, longitude:userLongitude},
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
};

module.exports = userLabController;
