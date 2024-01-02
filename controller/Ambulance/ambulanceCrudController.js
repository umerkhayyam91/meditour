const express = require("express");
const app = express();
const Ambulance = require("../../models/Ambulance/ambulance.js");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const ambulanceDTO = require("../../dto/ambulance.js");
const JWTService = require("../../services/JWTService.js");
const RefreshToken = require("../../models/token.js");
const AccessToken = require("../../models/accessToken.js");

const ambulanceCrudController = {
  async addAmbulance(req, res, next) {
    const ambulanceSchema = Joi.object({
      vehicleType: Joi.string(),
      vehicleName: Joi.string(),
      vehicleModel: Joi.string(),
      vehicleYear: Joi.string(),
      vehicleColor: Joi.string(),
      vehicleFacilities: Joi.number(),
      registrationNo: Joi.number(),
      registrationDate: Joi.number(),
      actualPrice: Joi.number(),
      priceForMeditour: Joi.number(),
    });

    const { error } = ambulanceSchema.validate(req.body);

    if (error) {
      return next(error);
    }
    const ambulanceCompanyId = req.user._id;
    const {
      vehicleType,
      vehicleName,
      vehicleModel,
      vehicleYear,
      vehicleColor,
      vehicleFacilities,
      registrationNo,
      registrationDate,
      actualPrice,
      priceForMeditour,
    } = req.body;

    let ambulance;

    try {
      const ambulanceToRegister = new Ambulance({
        ambulanceCompanyId,
        vehicleType,
        vehicleName,
        vehicleModel,
        vehicleYear,
        vehicleColor,
        vehicleFacilities,
        registrationNo,
        registrationDate,
        actualPrice,
        priceForMeditour,
      });

      ambulance = await ambulanceToRegister.save();
    } catch (error) {
      return next(error);
    }

    // 6. response send
    console.log(ambulance);
    const ambulanceDto = new ambulanceDTO(ambulance);
    console.log(ambulanceDto);

    return res.status(201).json({ Ambulance: ambulanceDto, auth: true });
  },

  async editAmbulance(req, res, next) {
    const ambulanceSchema = Joi.object({
      vehicleType: Joi.string(),
      vehicleName: Joi.string(),
      vehicleModel: Joi.string(),
      vehicleYear: Joi.string(),
      vehicleColor: Joi.string(),
      vehicleFacilities: Joi.string(),
      registrationNo: Joi.string(),
      registrationDate: Joi.string(),
      priceForMeditour: Joi.number(),
      actualPrice: Joi.number(),
    });

    const { error } = ambulanceSchema.validate(req.body);

    if (error) {
      return next(error);
    }
    const {
      vehicleType,
      vehicleName,
      vehicleModel,
      vehicleYear,
      vehicleColor,
      vehicleFacilities,
      registrationNo,
      registrationDate,
      priceForMeditour,
      actualPrice,
    } = req.body;
    const ambulanceCompanyId = req.user._id;
    // console.log(pharmId);
    // try {
    //   const testInUse = await Tests.exists({ testName, pharmId });

    //   if (testInUse) {
    //     const error = new Error("Test already added, use another TestName!");
    //     error.status = 409;
    //     return next(error);
    //   }
    // } catch (error) {
    //   return next(error);
    // }

    const ambulanceId = req.query.ambulanceId;
    const existingAmbulance = await Ambulance.findById(ambulanceId);

    if (!existingAmbulance) {
      const error = new Error("Ambulance not found!");
      error.status = 404;
      return next(error);
    }

    // Update only the provided fields
    if (vehicleType) existingAmbulance.vehicleType = vehicleType;
    if (vehicleName) existingAmbulance.vehicleName = vehicleName;
    if (vehicleModel) existingAmbulance.vehicleModel = vehicleModel;
    if (vehicleYear) existingAmbulance.vehicleYear = vehicleYear;
    if (vehicleColor) existingAmbulance.vehicleColor = vehicleColor;
    if (vehicleFacilities)
      existingAmbulance.vehicleFacilities = vehicleFacilities;
    if (registrationNo) existingAmbulance.registrationNo = registrationNo;
    if (registrationDate) existingAmbulance.registrationDate = registrationDate;
    if (priceForMeditour) existingAmbulance.priceForMeditour = priceForMeditour;
    if (actualPrice) existingAmbulance.actualPrice = actualPrice;

    // Save the updated ambulance
    await existingAmbulance.save();

    return res
      .status(200)
      .json({
        message: "Test updated successfully",
        ambulance: existingAmbulance,
      });
  },

  async deleteAmbulance(req, res, next) {
    const ambulanceId = req.query.ambulanceId;
    const existingAmbulance = await Ambulance.findById(ambulanceId);

    if (!existingAmbulance) {
      const error = new Error("Ambulance not found!");
      error.status = 404;
      return next(error);
    }
    await Ambulance.deleteOne({ ambulanceId });
    return res.status(200).json({ message: "Ambulance deleted successfully" });
  },

  async getAmbulance(req, res, next) {
    try {
      const ambulanceId = req.query.ambulanceId;
      const ambulance = await Ambulance.findById(ambulanceId);

      if (!ambulance) {
        const error = new Error("Ambulance not found!");
        error.status = 404;
        return next(error);
      }
      return res.status(200).json({ ambulance });
    } catch (error) {
      return next(error);
    }
  },

  async getAllAmbulances(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1; // Get the page number from the query parameter
      const ambulancePerPage = 10;
      const ambulanceCompanyId = req.user._id;
      const totalAmbulance = await Ambulance.countDocuments({
        ambulanceCompanyId,
      }); // Get the total number of posts for the user
      const totalPages = Math.ceil(totalAmbulance / ambulancePerPage); // Calculate the total number of pages

      const skip = (page - 1) * ambulancePerPage; // Calculate the number of posts to skip based on the current page

      const ambulances = await Ambulance.find({ ambulanceCompanyId })
        .skip(skip)
        .limit(ambulancePerPage);
      let previousPage = page > 1 ? page - 1 : null;
      let nextPage = page < totalPages ? page + 1 : null;
      return res.status(200).json({
        ambulances: ambulances,
        auth: true,
        previousPage: previousPage,
        nextPage: nextPage,
      });
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = ambulanceCrudController;
