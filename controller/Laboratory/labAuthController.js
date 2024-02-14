const express = require("express");
const app = express();
const Laboratory = require("../../models/Laboratory/laboratory.js");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const Order = require("../../models/Laboratory/labOrder.js");
const serviceAccount = require("../../serviceAccountKey.json");
const multer = require("multer");
const fs = require("fs");
const admin = require("firebase-admin");
const bodyParser = require("body-parser");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const LabDTO = require("../../dto/lab.js");
const orderDto = require("../../dto/labOrder.js");
const JWTService = require("../../services/JWTService.js");
const RefreshToken = require("../../models/token.js");
const AccessToken = require("../../models/accessToken.js");

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;

const labAuthController = {
  async register(req, res, next) {
    // 1. validate user input
    const labRegisterSchema = Joi.object({
      labLogo: Joi.string().required(),
      labLicenseImage: Joi.string().required(),
      cnicImage: Joi.string().required(),
      taxFileImage: Joi.string().required(),
      labFirstName: Joi.string().required(),
      labLastName: Joi.string().required(),
      loc: Joi.array().required(),
      labLicenseNumber: Joi.string().required(),
      OwnerName: Joi.string().required(),
      cnicOrPassportNo: Joi.string().required(),
      labAddress: Joi.string().required(),
      emergencyNo: Joi.string().required(),
      state: Joi.string().required(),
      website: Joi.string(),
      twitter: Joi.string(),
      facebook: Joi.string(),
      instagram: Joi.string(),
      incomeTaxNo: Joi.string().required(),
      salesTaxNo: Joi.string().required(),
      bankName: Joi.string().required(),
      accountHolderName: Joi.string().required(),
      accountNumber: Joi.string().required(),
      country: Joi.string().required(),
      description: Joi.string().required(),
      availabilityDuration: Joi.string().required(),
      availability: Joi.boolean().required(),
    });

    const { error } = labRegisterSchema.validate(req.body);

    // 2. if error in validation -> return error via middleware
    if (error) {
      return next(error);
    }

    // 3. if email or username is already registered -> return an error
    const {
      labLogo,
      labLicenseImage,
      cnicImage,
      taxFileImage,
      labFirstName,
      labLastName,
      loc,
      labLicenseNumber,
      OwnerName,
      cnicOrPassportNo,
      labAddress,
      emergencyNo,
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
      accountNumber,
      description,
      availabilityDuration,
      availability,
    } = req.body;

    // 5. store user data in db
    let accessToken;
    let refreshToken;

    let lab;
    try {
      const labToRegister = new Laboratory({
        labLogo,
        labLicenseImage,
        cnicImage,
        taxFileImage,
        labFirstName,
        labLastName,
        loc,
        labLicenseNumber,
        OwnerName,
        cnicOrPassportNo,
        labAddress,
        emergencyNo,
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
        accountNumber,
        description,
        availabilityDuration,
        availability,
      });

      lab = await labToRegister.save();

      // token generation
      accessToken = JWTService.signAccessToken({ _id: lab._id }, "365d");

      refreshToken = JWTService.signRefreshToken({ _id: lab._id }, "365d");
    } catch (error) {
      return next(error);
    }

    // store refresh token in db
    await JWTService.storeRefreshToken(refreshToken, lab._id);
    await JWTService.storeAccessToken(accessToken, lab._id);

    // 6. response send

    return res
      .status(201)
      .json({ laboratory: lab, auth: true, token: accessToken });
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
      const emailRegex = new RegExp(email, "i");
      lab = await Laboratory.findOne({ email: { $regex: emailRegex } });
      if (!lab) {
        const error = {
          status: 401,
          message: "Invalid email",
        };

        return next(error);
      }
      if (lab.isVerified == false) {
        const error = {
          status: 401,
          message: "User not verified",
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

    const accessToken = JWTService.signAccessToken({ _id: lab._id }, "365d");
    const refreshToken = JWTService.signRefreshToken({ _id: lab._id }, "365d");
    // update refresh token in database
    try {
      await RefreshToken.updateOne(
        {
          userId: lab._id,
        },
        { token: refreshToken },
        { upsert: true }
      );
    } catch (error) {
      return next(error);
    }

    try {
      await AccessToken.updateOne(
        {
          userId: lab._id,
        },
        { token: accessToken },
        { upsert: true }
      );
    } catch (error) {
      return next(error);
    }

    // res.cookie("accessToken", accessToken, {
    //   maxAge: 1000 * 60 * 60 * 24,
    //   httpOnly: true,
    // });

    // res.cookie("refreshToken", refreshToken, {
    //   maxAge: 1000 * 60 * 60 * 24,
    //   httpOnly: true,
    // });

    const labDto = new LabDTO(lab);

    return res
      .status(200)
      .json({ lab: labDto, auth: true, token: accessToken });
  },

  async completeSignup(req, res, next) {
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
    const emailExists = await Laboratory.exists({ email });
    if (emailExists) {
      const error = new Error("Email already exists!");
      error.status = 400;
      return next(error);
    }

    const userId = req.query.id;
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
      .json({ message: "User updated successfully", lab: existingUser });
  },

  async updateProfile(req, res, next) {
    const labSchema = Joi.object({
      labFirstName: Joi.string(),
      labLastName: Joi.string(),
      loc: Joi.array(),
      labLicenseNumber: Joi.string(),
      OwnerName: Joi.string(),
      cnicOrPassportNo: Joi.string(),
      labAddress: Joi.string(),
      emergencyNo: Joi.string(),
      state: Joi.string(),
      phoneNumber: Joi.string(),
      currentPassword: Joi.string(),
      password: Joi.string().pattern(passwordPattern),
      confirmPassword: Joi.ref("password"),
      website: Joi.string(),
      twitter: Joi.string(),
      facebook: Joi.string(),
      instagram: Joi.string(),
      incomeTaxNo: Joi.string(),
      salesTaxNo: Joi.string(),
      bankName: Joi.string(),
      accountHolderName: Joi.string(),
      accountNumber: Joi.string(),
      labLicenseImage: Joi.string(),
      cnicImage: Joi.string(),
      taxFileImage: Joi.string(),
      description: Joi.string(),
      availabilityDuration: Joi.string(),
      availability: Joi.boolean(),
    });

    const { error } = labSchema.validate(req.body);

    if (error) {
      return next(error);
    }
    const {
      labFirstName,
      labLastName,
      loc,
      labLicenseNumber,
      OwnerName,
      cnicOrPassportNo,
      labAddress,
      emergencyNo,
      state,
      phoneNumber,
      currentPassword,
      password,
      website,
      twitter,
      facebook,
      instagram,
      incomeTaxNo,
      salesTaxNo,
      bankName,
      accountHolderName,
      accountNumber,
      labLicenseImage,
      cnicImage,
      taxFileImage,
      description,
      availabilityDuration,
      availability,
    } = req.body;
    const labId = req.user._id;
    console.log(labId);

    const lab = await Laboratory.findById(labId);

    if (!lab) {
      const error = new Error("Laboratory not found!");
      error.status = 404;
      return next(error);
    }

    if (currentPassword && password) {
      const match = await bcrypt.compare(currentPassword, lab.password);

      if (!match) {
        const error = {
          status: 401,
          message: "Invalid Password",
        };

        return next(error);
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      lab.password = hashedPassword;
    }

    // Update only the provided fields
    if (labFirstName) lab.labFirstName = labFirstName;
    if (labLastName) lab.labLastName = labLastName;
    if (loc) lab.loc = loc;
    if (labLicenseNumber) lab.labLicenseNumber = labLicenseNumber;
    if (OwnerName) lab.OwnerName = OwnerName;
    if (cnicOrPassportNo) lab.cnicOrPassportNo = cnicOrPassportNo;
    if (labAddress) lab.labAddress = labAddress;
    if (emergencyNo) lab.emergencyNo = emergencyNo;
    if (state) lab.state = state;
    if (phoneNumber) lab.phoneNumber = phoneNumber;
    if (website) lab.website = website;
    if (facebook) lab.facebook = facebook;
    if (twitter) lab.twitter = twitter;
    if (instagram) lab.instagram = instagram;
    if (incomeTaxNo) lab.incomeTaxNo = incomeTaxNo;
    if (salesTaxNo) lab.salesTaxNo = salesTaxNo;
    if (bankName) lab.bankName = bankName;
    if (accountHolderName) lab.accountHolderName = accountHolderName;
    if (accountNumber) lab.accountNumber = accountNumber;
    if (labLicenseImage) lab.labLicenseImage = labLicenseImage;
    if (cnicImage) lab.cnicImage = cnicImage;
    if (taxFileImage) lab.taxFileImage = taxFileImage;
    if (description) lab.description = description;
    if (availabilityDuration) lab.availabilityDuration = availabilityDuration;
    if (availability) lab.availability = availability;

    // Save the updated test
    await lab.save();

    return res
      .status(200)
      .json({ message: "Laboratory updated successfully", Laboratory: lab });
  },

  async logout(req, res, next) {
    const userId = req.user._id;
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader && authHeader.split(" ")[1];
    try {
      await RefreshToken.deleteOne({ userId });
    } catch (error) {
      return next(error);
    }
    try {
      await AccessToken.deleteOne({ token: accessToken });
    } catch (error) {
      return next(error);
    }

    // 2. response
    res.status(200).json({ user: null, auth: false });
  },

  async refresh(req, res, next) {
    // 1. get refreshToken from cookies
    // 2. verify refreshToken
    // 3. generate new tokens
    // 4. update db, return response

    // const originalRefreshToken = req.cookies.refreshToken;
    const authHeader = req.headers["authorization"];
    const originalRefreshToken = authHeader && authHeader.split(" ")[2];
    const accessToken = authHeader && authHeader.split(" ")[1];

    let id;

    try {
      id = JWTService.verifyRefreshToken(originalRefreshToken)._id;
    } catch (e) {
      const error = {
        status: 401,
        message: "Unauthorized",
      };

      return next(error);
    }
    // console.log(id)

    try {
      const match = RefreshToken.findOne({
        userId: id,
        token: originalRefreshToken,
      });

      if (!match) {
        const error = {
          status: 401,
          message: "Unauthorized",
        };

        return next(error);
      }
    } catch (e) {
      return next(e);
    }

    let accessId;
    try {
      accessId = JWTService.verifyAccessToken(accessToken)._id;
      console.log(accessId);
    } catch (e) {
      const error = {
        status: 401,
        message: "Unauthorized",
      };

      return next(error);
    }

    try {
      const match = AccessToken.findOne({
        userId: accessId,
        token: accessToken,
      });

      if (!match) {
        const error = {
          status: 401,
          message: "Unauthorized",
        };

        return next(error);
      }
    } catch (e) {
      return next(e);
    }

    try {
      let accessToken = JWTService.signAccessToken({ _id: id }, "365d");

      let refreshToken = JWTService.signRefreshToken({ _id: id }, "365d");
      // console.log(accessToken);
      // console.log(refreshToken);
      await RefreshToken.updateOne({ userId: id }, { token: refreshToken });
      await AccessToken.updateOne({ userId: accessId }, { token: accessToken });

      // res.cookie("accessToken", accessToken, {
      //   maxAge: 1000 * 60 * 60 * 24,
      //   httpOnly: true,
      // });

      // res.cookie("refreshToken", refreshToken, {
      //   maxAge: 1000 * 60 * 60 * 24,
      //   httpOnly: true,
      // });
      const lab = await Laboratory.findOne({ _id: id });

      const labDto = new LabDTO(lab);

      return res
        .status(200)
        .json({ lab: labDto, auth: true, accessToken: accessToken });
    } catch (e) {
      return next(e);
    }
  },
};

module.exports = labAuthController;
