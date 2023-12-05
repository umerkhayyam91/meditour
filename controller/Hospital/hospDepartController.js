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
  }
  
};

module.exports = hospDepartController;
