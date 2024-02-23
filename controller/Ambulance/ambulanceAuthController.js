const express = require("express");
const app = express();
const Ambulance = require("../../models/Ambulance/ambulanceCompany.js");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const ambulanceDto = require("../../dto/ambulanceCompany.js");
const JWTService = require("../../services/JWTService.js");
const RefreshToken = require("../../models/token.js");
const AccessToken = require("../../models/accessToken.js");

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;

const ambulanceAuthController = {
  async register(req, res, next) {
    const ambulanceRegisterSchema = Joi.object({
      ambulanceName: Joi.string().required(),
      registrationNumber: Joi.string().required(),
      ownerName: Joi.string().required(),
      cnicOrPassportNo: Joi.string().required(),
      companyAddress: Joi.string().required(),
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
      ambulanceLogo: Joi.string().required(),
      registrationImage: Joi.string().required(),
      cnicOrPassportImage: Joi.string().required(),
      taxFileImage: Joi.string(),
      fcmToken: Joi.string(),
    });

    const { error } = ambulanceRegisterSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const {
      ambulanceName,
      registrationNumber,
      ownerName,
      cnicOrPassportNo,
      companyAddress,
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
      ambulanceLogo,
      registrationImage,
      cnicOrPassportImage,
      taxFileImage,
      fcmToken
    } = req.body;

    let accessToken;
    let refreshToken;

    let ambulance;
    try {
      const ambulanceToRegister = new Ambulance({
        ambulanceName,
        registrationNumber,
        ownerName,
        cnicOrPassportNo,
        companyAddress,
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
        ambulanceLogo,
        registrationImage,
        cnicOrPassportImage,
        taxFileImage,
        fcmToken
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

    return res
      .status(201)
      .json({ ambulance: ambulance, auth: true, token: accessToken });
  },

  async login(req, res, next) {
    const ambulanceLoginSchema = Joi.object({
      email: Joi.string().min(5).max(30).required(),
      password: Joi.string().pattern(passwordPattern),
      fcmToken: Joi.string(),
    });

    const { error } = ambulanceLoginSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { email, password, fcmToken } = req.body;

    let ambulance;

    try {
      // match username
      const emailRegex = new RegExp(email, "i");

      ambulance = await Ambulance.findOne({ email: { $regex: emailRegex } });
      if (!ambulance) {
        const error = {
          status: 401,
          message: "Invalid email",
        };

        return next(error);
      }else {
        //update fcmToken
        if (fcmToken && ambulance?.fcmToken !== fcmToken) {
          Object.keys(ambulance).map((key) => (ambulance["fcmToken"] = fcmToken));

          let update = await ambulance.save();
        } else {
          console.log("same Token");
        }
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
      ambulanceName: Joi.string(),
      registrationNumber: Joi.string(),
      ownerName: Joi.string(),
      cnicOrPassportNo: Joi.string(),
      companyAddress: Joi.string(),
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
      registrationImage: Joi.string(),
      cnicOrPassportImage: Joi.string(),
      taxFileImage: Joi.string(),
    });

    const { error } = ambulanceSchema.validate(req.body);

    if (error) {
      return next(error);
    }
    const {
      ambulanceName,
      registrationNumber,
      ownerName,
      cnicOrPassportNo,
      companyAddress,
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
      registrationImage,
      cnicOrPassportImage,
      taxFileImage
    } = req.body;
    const ambulanceId = req.user._id;

    const ambulance = await Ambulance.findById(ambulanceId);

    if (!ambulance) {
      const error = new Error("Ambulance not found!");
      error.status = 404;
      return next(error);
    }

    
    if (currentPassword && password) {
      const match = await bcrypt.compare(currentPassword, ambulance.password);

      if (!match) {
        const error = {
          status: 401,
          message: "Invalid Password",
        };

        return next(error);
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      ambulance.password = hashedPassword;
    }

    // Update only the provided fields
    if (ambulanceName) ambulance.ambulanceName = ambulanceName;
    if (registrationNumber) ambulance.registrationNumber = registrationNumber;
    if (ownerName) ambulance.ownerName = ownerName;
    if (cnicOrPassportNo) ambulance.cnicOrPassportNo = cnicOrPassportNo;
    if (companyAddress) ambulance.companyAddress = companyAddress;
    if (emergencyNo) ambulance.emergencyNo = emergencyNo;
    if (state) ambulance.state = state;
    if (phoneNumber) ambulance.phoneNumber = phoneNumber;
    if (website) ambulance.website = website;
    if (facebook) ambulance.facebook = facebook;
    if (twitter) ambulance.twitter = twitter;
    if (instagram) ambulance.instagram = instagram;
    if (incomeTaxNo) ambulance.incomeTaxNo = incomeTaxNo;
    if (salesTaxNo) ambulance.salesTaxNo = salesTaxNo;
    if (bankName) ambulance.bankName = bankName;
    if (accountHolderName) ambulance.accountHolderName = accountHolderName;
    if (accountNumber) ambulance.accountNumber = accountNumber;
    if (registrationImage) ambulance.registrationImage = registrationImage;
    if (cnicOrPassportImage) ambulance.cnicOrPassportImage = cnicOrPassportImage;
    if (taxFileImage) ambulance.taxFileImage = taxFileImage;

    // Save the updated test
    await ambulance.save();

    return res.status(200).json({
      message: "Ambulance updated successfully",
      Ambulance: ambulance,
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

      const ambulance = await Ambulance.findOne({ _id: id });

      const ambulanceDTO = new ambulanceDto(ambulance);

      return res.status(200).json({
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
