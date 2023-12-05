const express = require("express");
const app = express();
const Hospital = require("../../models/Hospital/hospital.js");
const Department = require("../../models/Hospital/dapartment.js");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const departDTO = require("../../dto/department.js");
const JWTService = require("../../services/JWTService.js");
const RefreshToken = require("../../models/token.js");
const AccessToken = require("../../models/accessToken.js");

const hospDepartController = {
  async addDepart(req, res, next) {
    const hospitalId = req.user._id;
    const hospDepartSchema = Joi.object({
      departmentName: Joi.string().required(),
      availableDoctors: Joi.number().required(),
      dapartmentLogo: Joi.string().required(),
    });

    const { error } = hospDepartSchema.validate(req.body);

    if (error) {
      return next(error);
    }
    const { departmentName, availableDoctors, dapartmentLogo } = req.body;
    let depart;
    try {
      const hospToRegister = new Department({
        hospitalId,
        departmentName,
        availableDoctors,
        dapartmentLogo,
      });

      depart = await hospToRegister.save();
    } catch (error) {
      return next(error);
    }

    const departDto = new departDTO(depart);

    return res.status(201).json({ department: departDto, auth: true });
  },

  async editDepart(req, res, next) {
    const hospitalId = req.user._id;
    const departmentId = req.query.id; // Assuming you pass departmentId in the request parameters
    const hospDepartSchema = Joi.object({
      departmentName: Joi.string(),
      availableDoctors: Joi.number(),
      dapartmentLogo: Joi.string(),
    });
  
    const { error } = hospDepartSchema.validate(req.body);
  
    if (error) {
      return next(error);
    }
  
    const { departmentName, availableDoctors, dapartmentLogo } = req.body;
    let depart;
    
    try {
      // Assuming Department is the mongoose model for the department schema
      depart = await Department.findOneAndUpdate(
        { _id: departmentId, hospitalId },
        { $set: { departmentName, availableDoctors, dapartmentLogo } },
        { new: true }
      );
  
      if (!depart) {
        return res.status(404).json({ message: 'Department not found' });
      }
    } catch (error) {
      return next(error);
    }
  
    const departDto = new departDTO(depart);
  
    return res.status(200).json({ department: departDto, auth: true });
  },
  
  async deleteMed(req, res, next) {
    const medId = req.query.medId;
    const existingMed = await Medicine.findById(medId);

    if (!existingMed) {
      const error = new Error("Medicine not found!");
      error.status = 404;
      return next(error);
    }
    await Medicine.deleteOne({ medId });
    return res.status(200).json({ message: "Medicine deleted successfully" });
  },

  async getMed(req, res, next) {
    try {
      const medId = req.query.medId;
      const medicine = await Medicine.findById(medId);

      if (!medicine) {
        const error = new Error("Medicine not found!");
        error.status = 404;
        return next(error);
      }
      return res.status(200).json({ medicine });
    } catch (error) {
      return next(error);
    }
  },

  async getAllMeds(req, res, next) {
    try {
      console.log(req)

      const page = parseInt(req.query.page) || 1; // Get the page number from the query parameter
      const medPerPage = 10;
      const pharmId = req.user._id;
      console.log("pharmId", pharmId)
      const totalMeds = await Medicine.countDocuments({ pharmId }); // Get the total number of posts for the user
      const totalPages = Math.ceil(totalMeds / medPerPage); // Calculate the total number of pages

      const skip = (page - 1) * medPerPage; // Calculate the number of posts to skip based on the current page

      const medicines = await Medicine
        .find({ pharmId })
        .skip(skip)
        .limit(medPerPage);
      let previousPage = page > 1 ? page - 1 : null;
      let nextPage = page < totalPages ? page + 1 : null;
      // const medDto = new medDTO(medicines);
      return res
        .status(200)
        .json({
          medicines: medicines,
          auth: true,
          previousPage: previousPage,
          nextPage: nextPage,
        }); 
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = hospDepartController;
