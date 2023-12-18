const express = require("express");
const app = express();
const Insurance = require("../../models/Insurance/insurance.js");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const insuranceDTO = require("../../dto/insurance.js");
const JWTService = require("../../services/JWTService.js");
const RefreshToken = require("../../models/token.js");
const AccessToken = require("../../models/accessToken.js");

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;

const insuranceAuthController = {
  async register(req, res, next) {
    const insuranceRegisterSchema = Joi.object({
      companyFirstName: Joi.string().required(),
      companyLastName: Joi.string().required(),
      licenseNo: Joi.string().required(),
      licenceExpiry: Joi.string().required(),
      ownerFirstName: Joi.string().required(),
      ownerLastName: Joi.string().required(),
      cnicOrPassportNo: Joi.string().required(),
      expiryDate: Joi.string().required(),
      companyExperiences: Joi.string().required(),
      companyAddress: Joi.string().required(),
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

    const { error } = insuranceRegisterSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const {
        companyFirstName,
        companyLastName,
        licenseNo,
        licenceExpiry,
        ownerFirstName,
        ownerLastName,
        cnicOrPassportNo,
        expiryDate,
        companyExperiences,
        companyAddress,
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

    let insurance;
    try {
      const insuranceToRegister = new Insurance({
        companyFirstName,
        companyLastName,
        licenseNo,
        licenceExpiry,
        ownerFirstName,
        ownerLastName,
        cnicOrPassportNo,
        expiryDate,
        companyExperiences,
        companyAddress,
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

      insurance = await insuranceToRegister.save();

      // token generation
      accessToken = JWTService.signAccessToken({ _id: insurance._id }, "365d");

      refreshToken = JWTService.signRefreshToken({ _id: insurance._id }, "365d");
    } catch (error) {
      return next(error);
    }

    // store refresh token in db
    await JWTService.storeRefreshToken(refreshToken, insurance._id);
    await JWTService.storeAccessToken(accessToken, insurance._id);

    // 6. response send

    return res
      .status(201)
      .json({ insurance: insurance, auth: true, token: accessToken });
  },

  async login(req, res, next) {
    const insuranceSchema = Joi.object({
      email: Joi.string().min(5).max(30).required(),
      password: Joi.string().pattern(passwordPattern),
    });

    const { error } = insuranceSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { email, password } = req.body;

    let insurance;

    try {
      // match username
      insurance = await Insurance.findOne({ email: email });
      if (!insurance) {
        const error = {
          status: 401,
          message: "Invalid email",
        };

        return next(error);
      }
      if (insurance.isVerified == false) {
        const error = {
          status: 401,
          message: "User not verified",
        };

        return next(error);
      }

      // match password

      const match = await bcrypt.compare(password, insurance.password);

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

    const accessToken = JWTService.signAccessToken({ _id: insurance._id }, "365d");
    const refreshToken = JWTService.signRefreshToken(
      { _id: insurance._id },
      "365d"
    );
    // update refresh token in database
    try {
      await RefreshToken.updateOne(
        {
          userId: insurance._id,
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
          userId: insurance._id,
        },
        { token: accessToken },
        { upsert: true }
      );
    } catch (error) {
      return next(error);
    }

    const insuranceDto = new insuranceDTO(insurance);

    return res
      .status(200)
      .json({ insurance: insuranceDto, auth: true, token: accessToken });
  },

  async completeSignup(req, res, next) {
    const insuranceRegisterSchema = Joi.object({
      phoneNumber: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().pattern(passwordPattern).required(),
      confirmPassword: Joi.ref("password"),
    });

    const { error } = insuranceRegisterSchema.validate(req.body);

    // 2. if error in validation -> return error via middleware
    if (error) {
      return next(error);
    }

    const { password, email, phoneNumber } = req.body;

    const userId = req.query.id;
    const existingUser = await Insurance.findById(userId);

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

    return res.status(200).json({
      message: "User updated successfully",
      insurance: existingUser,
    });
  },

  async updateProfile(req, res, next) {
    const insuranceSchema = Joi.object({
      website: Joi.string(),
      twitter: Joi.string(),
      facebook: Joi.string(),
      instagram: Joi.string(),
      bankName: Joi.string(),
      accountHolderName: Joi.string(),
      accountNumber: Joi.string(),
    });

    const { error } = insuranceSchema.validate(req.body);

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
    const insuranceId = req.user._id;

    const insurance = await Insurance.findById(insuranceId);

    if (!insurance) {
      const error = new Error("insurance not found!");
      error.status = 404;
      return next(error);
    }

    // Update only the provided fields
    if (website) insurance.website = website;
    if (facebook) insurance.facebook = facebook;
    if (twitter) insurance.twitter = twitter;
    if (instagram) insurance.instagram = instagram;
    if (bankName) insurance.bankName = bankName;
    if (accountHolderName) insurance.accountHolderName = accountHolderName;
    if (accountNumber) insurance.accountNumber = accountNumber;

    // Save the updated test
    await insurance.save();

    return res.status(200).json({
      message: "Insurance updated successfully",
      insurance: insurance,
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

      const insurance = await Insurance.findOne({ _id: id });

      const insuranceDto = new insuranceDTO(insurance);

      return res.status(200).json({
        insurance: insuranceDto,
        auth: true,
        accessToken: accessToken,
      });
    } catch (e) {
      return next(e);
    }
  },
};

module.exports = insuranceAuthController;
