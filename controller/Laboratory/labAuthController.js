const express = require("express");
const app = express();
const Laboratory = require("../../models/Laboratory/laboratory.js");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Order = require("../../models/Laboratory/order.js");
const serviceAccount = require("../../serviceAccountKey.json");
const multer = require("multer");
const fs = require("fs");
const admin = require("firebase-admin");
const bodyParser = require("body-parser");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const LabDTO = require("../../dto/lab.js");
const orderDto = require("../../dto/order.js");
const JWTService = require("../../services/JWTService.js");
const RefreshToken = require("../../models/token.js");

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;

const labAuthController = {
  async register(req, res, next) {
    // 1. validate user input
    const labRegisterSchema = Joi.object({
      // email: Joi.string().email().required(),
      labLogo: Joi.string().required(),
      labLicenseImage: Joi.string().required(),
      cnicImage: Joi.string().required(),
      taxFileImage: Joi.string().required(),
      // phoneNumber: Joi.string().required(),
      // password: Joi.string().pattern(passwordPattern).required(),
      // confirmPassword: Joi.ref("password"),
      labFirstName: Joi.string().required(),
      labLastName: Joi.string().required(),
      labLicenseNumber: Joi.string().required(),
      labExpiryDate: Joi.string().required(),
      OwnerFirstName: Joi.string().required(),
      OwnerMiddleName: Joi.string().required(),
      OwnerLastName: Joi.string().required(),
      cnicOrPassportNo: Joi.string().required(),
      cnicOrPassportExpiry: Joi.string().required(),
      labAddress: Joi.string().required(),
      state: Joi.string().required(),
      website: Joi.string().required(),
      twitter: Joi.string().required(),
      facebook: Joi.string().required(),
      instagram: Joi.string().required(),
      incomeTaxNo: Joi.string().required(),
      salesTaxNo: Joi.string().required(),
      bankName: Joi.string().required(),
      accountHolderName: Joi.string().required(),
      accountName: Joi.string().required(),
      country: Joi.string().required(),
    });

    const { error } = labRegisterSchema.validate(req.body);

    // 2. if error in validation -> return error via middleware
    if (error) {
      return next(error);
    }

    // 3. if email or username is already registered -> return an error
    const {
      labFirstName,
      labLastName,
      labLicenseNumber,
      labExpiryDate,
      OwnerFirstName,
      OwnerMiddleName,
      OwnerLastName,
      cnicOrPassportNo,
      cnicOrPassportExpiry,
      labAddress,
      state,
      country,
      website,
      twitter,
      facebook,
      instagram,
      incomeTaxNo,
      salesTaxNo,
      bankName,
      accountHolderName,
      accountName,
      // email,
      // password,
      // confirmPassword,
      // phoneNumber,
      labLogo,
      labLicenseImage,
      taxFileImage,
      cnicImage,
    } = req.body;

    // try {
    //   // Inside your try-catch block
    //   const emailInUse = await Laboratory.exists({ email });

    //   if (emailInUse) {
    //     const error = new Error("Email already registered, use another email!");
    //     error.status = 409;
    //     return next(error);
    //   }
    // } catch (error) {
    //   return next(error);
    // }

    // 4. password hash
    // const hashedPassword = await bcrypt.hash(password, 10);

    // 5. store user data in db
    let accessToken;
    let refreshToken;

    let lab;
    const randomNumber = Math.floor(Math.random() * 1000000); // Generate a random number between 0 and 99999999
    // const sixDigitId = randomNumber.toString().padStart(8, '0'); // Ensure it is eight digits long
    try {
      const labToRegister = new Laboratory({
        labFirstName,
        labLastName,
        labLicenseNumber,
        labExpiryDate,
        OwnerFirstName,
        OwnerMiddleName,
        OwnerLastName,
        cnicOrPassportNo,
        cnicOrPassportExpiry,
        labAddress,
        state,
        country,
        website,
        twitter,
        facebook,
        instagram,
        incomeTaxNo,
        salesTaxNo,
        bankName,
        accountHolderName,
        accountName,
        // email,
        // phoneNumber,
        labLogo,
        labLicenseImage,
        taxFileImage,
        cnicImage,
        // password: hashedPassword,
        MR_NO: randomNumber,
      });

      lab = await labToRegister.save();

      // token generation
      accessToken = JWTService.signAccessToken({ _id: lab._id }, "90m");

      refreshToken = JWTService.signRefreshToken({ _id: lab._id }, "120m");
    } catch (error) {
      return next(error);
    }

    // store refresh token in db
    await JWTService.storeRefreshToken(refreshToken, lab._id);

    // send tokens in cookie
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    // 6. response send

    const labDto = new LabDTO(lab);

    return res
      .status(201)
      .json({ lab: labDto, auth: true, token: accessToken });
  },

  async login(req, res, next) {
    // 1. validate user input
    // 2. if validation error, return error
    // 3. match username and password
    // 4. return response

    // we expect input data to be in such shape
    const labLoginSchema = Joi.object({
      email: Joi.string().min(5).max(30).required(),
      password: Joi.string().pattern(passwordPattern),
    });

    const { error } = labLoginSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { email, password } = req.body;

    // const username = req.body.username
    // const password = req.body.password

    let lab;

    try {
      // match username
      lab = await Laboratory.findOne({ email: email });
      if(lab.isVerified==false){
        const error = {
          status: 401,
          message: "User not verified",
        };

        return next(error);
      }
      

      if (!lab) {
        const error = {
          status: 401,
          message: "Invalid email",
        };

        return next(error);
      }

      // match password

      const match = await bcrypt.compare(password, lab.password);

      if (!match) {
        const error = {
          status: 401,
          message: "Invalid Password",
        };

        return next(error);
      }
    } catch (error) {
      return next(error);
    }

    const accessToken = JWTService.signAccessToken({ _id: lab._id }, "30m");
    const refreshToken = JWTService.signRefreshToken({ _id: lab._id }, "60m");

    // update refresh token in database
    try {
      await RefreshToken.updateOne(
        {
          _id: lab._id,
        },
        { token: refreshToken },
        { upsert: true }
      );
    } catch (error) {
      return next(error);
    }

    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    const labDto = new LabDTO(lab);

    return res
      .status(200)
      .json({ lab: labDto, auth: true, token: accessToken });
  },

  async verify(req, res, next) {
    const labRegisterSchema = Joi.object({
      phoneNumber: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().pattern(passwordPattern).required(),
      confirmPassword: Joi.ref("password"),
    });

    const { error } = labRegisterSchema.validate(req.body);

    // 2. if error in validation -> return error via middleware
    if (error) {
      return next(error);
    }

    const { password, email, phoneNumber } = req.body;

    const userId = "65649fad03a247ed90f99464";
    const existingUser = await Laboratory.findById(userId);

    if (!existingUser) {
      const error = new Error("User not found!");
      error.status = 404;
      return next(error);
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update only the provided fields
     existingUser.email = email;
     existingUser.password = hashedPassword;
     existingUser.phoneNumber = phoneNumber;
     existingUser.isVerified = true;

    // Save the updated test
    await existingUser.save();

    return res
      .status(200)
      .json({ message: "User updated successfully", test: existingUser });

  },

  
};

module.exports = labAuthController;
