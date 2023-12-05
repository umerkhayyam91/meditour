const express = require("express");
const app = express();
const Ambulance = require("../../models/Ambulance/ambulance.js");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const ambulanceDto = require("../../dto/ambulance.js");
const JWTService = require("../../services/JWTService.js");
const RefreshToken = require("../../models/token.js");
const AccessToken = require("../../models/accessToken.js");

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;

const ambulanceAuthController = {
  async register(req, res, next) {
    const ambulanceRegisterSchema = Joi.object({
      companyName: Joi.string().required(),
      companyDetail: Joi.string().required(),
      authorizedName: Joi.string().required(),
      authorizedDetail: Joi.string().required(),
      authorizedCnic: Joi.string().required(),
      qualification: Joi.string().required(),
      emergencyContact: Joi.string().required(),
      registrationNumber: Joi.string().required(),
      cellNo: Joi.string().required(),
      ambulanceEquipDetail: Joi.string().required(),
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
      cnicImage: Joi.string(),
      taxFileImage: Joi.string(),
    });

    const { error } = ambulanceRegisterSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const {
      companyName,
      companyDetail,
      authorizedName,
      authorizedDetail,
      authorizedCnic,
      qualification,
      emergencyContact,
      registrationNumber,
      cellNo,
      ambulanceEquipDetail,
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
      cnicImage,
      taxFileImage,
    } = req.body;

    let accessToken;
    let refreshToken;

    let ambulance;
    try {
      const ambulanceToRegister = new Ambulance({
        companyName,
        companyDetail,
        authorizedName,
        authorizedDetail,
        authorizedCnic,
        qualification,
        emergencyContact,
        registrationNumber,
        cellNo,
        ambulanceEquipDetail,
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
        cnicImage,
        taxFileImage,
      });

      ambulance = await ambulanceToRegister.save();

      // token generation
      accessToken = JWTService.signAccessToken({ _id: ambulance._id }, "365d");

      refreshToken = JWTService.signRefreshToken(
        { _id: ambulance._id },
        "365d"
      );
    } catch (error) {
      return next(error);
    }

    // store refresh token in db
    await JWTService.storeRefreshToken(refreshToken, ambulance._id);
    await JWTService.storeAccessToken(accessToken, ambulance._id);

    // 6. response send

    const ambulanceDto = new ambulanceDto(ambulance);

    return res
      .status(201)
      .json({ ambulance: ambulanceDto, auth: true, token: accessToken });
  },

  async login(req, res, next) {
    const ambulanceLoginSchema = Joi.object({
      email: Joi.string().min(5).max(30).required(),
      password: Joi.string().pattern(passwordPattern),
    });

    const { error } = ambulanceLoginSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { email, password } = req.body;

    let ambulance;

    try {
      // match username
      ambulance = await Ambulance.findOne({ email: email });
      if (!ambulance) {
        const error = {
          status: 401,
          message: "Invalid email",
        };

        return next(error);
      }
      if (ambulance.isVerified == false) {
        const error = {
          status: 401,
          message: "User not verified",
        };

        return next(error);
      }

      // match password

      const match = await bcrypt.compare(password, ambulance.password);

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

    const accessToken = JWTService.signAccessToken(
      { _id: ambulance._id },
      "365d"
    );
    const refreshToken = JWTService.signRefreshToken(
      { _id: ambulance._id },
      "365d"
    );
    // update refresh token in database
    try {
      await RefreshToken.updateOne(
        {
          userId: ambulance._id,
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
          userId: ambulance._id,
        },
        { token: accessToken },
        { upsert: true }
      );
    } catch (error) {
      return next(error);
    }

    const ambulanceDTO = new ambulanceDto(ambulance);

    return res
      .status(200)
      .json({ ambulance: ambulanceDTO, auth: true, token: accessToken });
  },

  async completeSignup(req, res, next) {
    const ambulanceRegisterSchema = Joi.object({
      phoneNumber: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().pattern(passwordPattern).required(),
      confirmPassword: Joi.ref("password"),
    });

    const { error } = ambulanceRegisterSchema.validate(req.body);

    // 2. if error in validation -> return error via middleware
    if (error) {
      return next(error);
    }

    const { password, email, phoneNumber } = req.body;

    const userId = req.query.id;
    const existingUser = await Ambulance.findById(userId);

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
      .json({ message: "User updated successfully", Ambulance: existingUser });
  },

  async updateProfile(req, res, next) {
    const ambulanceSchema = Joi.object({
      website: Joi.string(),
      twitter: Joi.string(),
      facebook: Joi.string(),
      instagram: Joi.string(),
      bankName: Joi.string(),
      accountHolderName: Joi.string(),
      accountNumber: Joi.string(),
    });

    const { error } = ambulanceSchema.validate(req.body);

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
    const ambulanceId = req.user._id;

    const ambulance = await Ambulance.findById(ambulanceId);

    if (!ambulance) {
      const error = new Error("Ambulance not found!");
      error.status = 404;
      return next(error);
    }

    // Update only the provided fields
    if (website) ambulance.website = website;
    if (facebook) ambulance.facebook = facebook;
    if (twitter) ambulance.twitter = twitter;
    if (instagram) ambulance.instagram = instagram;
    if (bankName) ambulance.bankName = bankName;
    if (accountHolderName) ambulance.accountHolderName = accountHolderName;
    if (accountNumber) ambulance.accountNumber = accountNumber;

    // Save the updated test
    await ambulance.save();

    return res
      .status(200)
      .json({
        message: "Ambulance updated successfully",
        Ambulance: ambulance,
      });
  },

  async logout(req, res, next) {
    // 1. delete refresh token from db
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader && authHeader.split(" ")[1];
    const refreshToken = authHeader && authHeader.split(" ")[2];

    try {
      await RefreshToken.deleteOne({ token: refreshToken });
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

      const ambulance = await Ambulance.findOne({ _id: id });

      const ambulanceDTO = new ambulanceDto(ambulance);

      return res
        .status(200)
        .json({
          Ambulance: ambulanceDTO,
          auth: true,
          accessToken: accessToken,
        });
    } catch (e) {
      return next(e);
    }
  },
};

module.exports = ambulanceAuthController;
