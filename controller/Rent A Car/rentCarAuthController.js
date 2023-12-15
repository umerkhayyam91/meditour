const express = require("express");
const app = express();
const RentCar = require("../../models/Rent A Car/rentCar.js");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const rentCarDTO = require("../../dto/rentCar.js");
const JWTService = require("../../services/JWTService.js");
const RefreshToken = require("../../models/token.js");
const AccessToken = require("../../models/accessToken.js");

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;

const ambulanceAuthController = {
  async register(req, res, next) {
    const ambulanceRegisterSchema = Joi.object({
      ownerName: Joi.string().required(),
      fatherName: Joi.string().required(),
      cnicOrPassportNo: Joi.string().required(),
      expiryDate: Joi.string().required(),
      companyName: Joi.string().required(),
      companyLastName: Joi.string().required(),
      licenseNo: Joi.string().required(),
      licenseExpiry: Joi.string().required(),
      companyAddress: Joi.string().required(),
      companyExperiences: Joi.string().required(),
      emergencyNo: Joi.string().required(),
      state: Joi.string().required(),
      country: Joi.string(),
      website: Joi.string(),
      twitter: Joi.string(),
      facebook: Joi.string(),
      instagram: Joi.string(),
      incomeTaxNo: Joi.string().required(),
      salesTaxNo: Joi.string().required(),
      bankName: Joi.string().required(),
      accountHolderName: Joi.string().required(),
      accountNumber: Joi.string().required(),
      companyLogo: Joi.string().required(),
      licenseImage: Joi.string().required(),
      ownerImage: Joi.string().required(),
      cnicImage: Joi.string().required(),
      taxFileImage: Joi.string(),
    });

    const { error } = ambulanceRegisterSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const {
        ownerName,
        fatherName,
        cnicOrPassportNo,
        expiryDate,
        companyName,
        companyLastName,
        licenseNo,
        licenseExpiry,
        companyAddress,
        companyExperiences,
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
        companyLogo,
        licenseImage,
        ownerImage,
        cnicImage,
        taxFileImage
    } = req.body;

    let accessToken;
    let refreshToken;

    let rentCar;
    try {
      const rentCarToRegister = new RentCar({
        ownerName,
        fatherName,
        cnicOrPassportNo,
        expiryDate,
        companyName,
        companyLastName,
        licenseNo,
        licenseExpiry,
        companyAddress,
        companyExperiences,
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
        companyLogo,
        licenseImage,
        ownerImage,
        cnicImage,
        taxFileImage
      });

      rentCar = await rentCarToRegister.save();

      // token generation
      accessToken = JWTService.signAccessToken({ _id: rentCar._id }, "365d");

      refreshToken = JWTService.signRefreshToken({ _id: rentCar._id }, "365d");
    } catch (error) {
      return next(error);
    }

    // store refresh token in db
    await JWTService.storeRefreshToken(refreshToken, rentCar._id);
    await JWTService.storeAccessToken(accessToken, rentCar._id);

    // 6. response send

    return res
      .status(201)
      .json({ rentCar: rentCar, auth: true, token: accessToken });
  },

  async login(req, res, next) {
    const rentCarSchema = Joi.object({
      email: Joi.string().min(5).max(30).required(),
      password: Joi.string().pattern(passwordPattern),
    });

    const { error } = rentCarSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { email, password } = req.body;

    let rentCar;

    try {
      // match username
      rentCar = await RentCar.findOne({ email: email });
      if (!rentCar) {
        const error = {
          status: 401,
          message: "Invalid email",
        };

        return next(error);
      }
      if (rentCar.isVerified == false) {
        const error = {
          status: 401,
          message: "User not verified",
        };

        return next(error);
      }

      // match password

      const match = await bcrypt.compare(password, rentCar.password);

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

    const accessToken = JWTService.signAccessToken({ _id: rentCar._id }, "365d");
    const refreshToken = JWTService.signRefreshToken(
      { _id: rentCar._id },
      "365d"
    );
    // update refresh token in database
    try {
      await RefreshToken.updateOne(
        {
          userId: rentCar._id,
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
          userId: rentCar._id,
        },
        { token: accessToken },
        { upsert: true }
      );
    } catch (error) {
      return next(error);
    }

    const rentCarDto = new rentCarDTO(rentCar);

    return res
      .status(200)
      .json({ rentCar: rentCarDto, auth: true, token: accessToken });
  },

  async completeSignup(req, res, next) {
    const rentCarRegisterSchema = Joi.object({
      phoneNumber: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().pattern(passwordPattern).required(),
      confirmPassword: Joi.ref("password"),
    });

    const { error } = rentCarRegisterSchema.validate(req.body);

    // 2. if error in validation -> return error via middleware
    if (error) {
      return next(error);
    }

    const { password, email, phoneNumber } = req.body;

    const userId = req.query.id;
    const existingUser = await RentCar.findById(userId);

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
      .json({
        message: "User updated successfully",
        rentCar: existingUser,
      });
  },

  async updateProfile(req, res, next) {
    const rentCarSchema = Joi.object({
      website: Joi.string(),
      twitter: Joi.string(),
      facebook: Joi.string(),
      instagram: Joi.string(),
      bankName: Joi.string(),
      accountHolderName: Joi.string(),
      accountNumber: Joi.string(),
    });

    const { error } = rentCarSchema.validate(req.body);

    if (error) {
      return next(error);
    }
    const {
      website,
      twitter,
      facebook,
      instagram,
      bankName,
      accountHolderName,
      accountNumber,
    } = req.body;
    const rentCarId = req.user._id;

    const rentCar = await RentCar.findById(rentCarId);

    if (!rentCar) {
      const error = new Error("Rent Car not found!");
      error.status = 404;
      return next(error);
    }

    // Update only the provided fields
    if (website) rentCar.website = website;
    if (facebook) rentCar.facebook = facebook;
    if (twitter) rentCar.twitter = twitter;
    if (instagram) rentCar.instagram = instagram;
    if (bankName) rentCar.bankName = bankName;
    if (accountHolderName) rentCar.accountHolderName = accountHolderName;
    if (accountNumber) rentCar.accountNumber = accountNumber;

    // Save the updated test
    await rentCar.save();

    return res.status(200).json({
      message: "Rent Car updated successfully",
      rentCar: rentCar,
    });
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
      await RefreshToken.updateOne({ userId: id }, { token: refreshToken });
      await AccessToken.updateOne({ userId: accessId }, { token: accessToken });

      const rentCar = await RentCar.findOne({ _id: id });

      const rentCarDto = new rentCarDTO(rentCar);

      return res.status(200).json({
        rentCar: rentCarDto,
        auth: true,
        accessToken: accessToken,
      });
    } catch (e) {
      return next(e);
    }
  },
};

module.exports = ambulanceAuthController;
