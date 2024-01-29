const express = require("express");
const app = express();
const Donation = require("../../models/Donation/donationCompany.js");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const donationDTO = require("../../dto/donation.js");
const JWTService = require("../../services/JWTService.js");
const RefreshToken = require("../../models/token.js");
const AccessToken = require("../../models/accessToken.js");

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;

const donationAuthController = {
  async register(req, res, next) {
    const donationRegisterSchema = Joi.object({
      companyName: Joi.string().required(),
      companyLicenseNo: Joi.string().required(),
      companyEmergencyNo: Joi.string().required(),
      cnicOrPassportNo: Joi.string().required(),
      ownerName: Joi.string().required(),
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
      cnicImage: Joi.string().required(),
      taxFileImage: Joi.string(),
    });

    const { error } = donationRegisterSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const {
      companyName,
      companyLicenseNo,
      companyEmergencyNo,
      cnicOrPassportNo,
      ownerName,
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
      cnicImage,
      taxFileImage,
    } = req.body;

    let accessToken;
    let refreshToken;

    let donation;
    try {
      const donationToRegister = new Donation({
        companyName,
        companyLicenseNo,
        companyEmergencyNo,
        cnicOrPassportNo,
        ownerName,
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
        cnicImage,
        taxFileImage,
      });

      donation = await donationToRegister.save();

      // token generation
      accessToken = JWTService.signAccessToken({ _id: donation._id }, "365d");

      refreshToken = JWTService.signRefreshToken({ _id: donation._id }, "365d");
    } catch (error) {
      return next(error);
    }

    // store refresh token in db
    await JWTService.storeRefreshToken(refreshToken, donation._id);
    await JWTService.storeAccessToken(accessToken, donation._id);

    // 6. response send

    return res
      .status(201)
      .json({ donation: donation, auth: true, token: accessToken });
  },

  async login(req, res, next) {
    const donationSchema = Joi.object({
      email: Joi.string().min(5).max(30).required(),
      password: Joi.string().pattern(passwordPattern),
    });

    const { error } = donationSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { email, password } = req.body;

    let donation;

    try {
      // match username
      const emailRegex = new RegExp(email, "i");
      donation = await Donation.findOne({ email: { $regex: emailRegex } });
      if (!donation) {
        const error = {
          status: 401,
          message: "Invalid email",
        };

        return next(error);
      }
      if (donation.isVerified == false) {
        const error = {
          status: 401,
          message: "User not verified",
        };

        return next(error);
      }

      // match password

      const match = await bcrypt.compare(password, donation.password);

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
      { _id: donation._id },
      "365d"
    );
    const refreshToken = JWTService.signRefreshToken(
      { _id: donation._id },
      "365d"
    );
    // update refresh token in database
    try {
      await RefreshToken.updateOne(
        {
          userId: donation._id,
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
          userId: donation._id,
        },
        { token: accessToken },
        { upsert: true }
      );
    } catch (error) {
      return next(error);
    }

    const donationDto = new donationDTO(donation);

    return res
      .status(200)
      .json({ donation: donationDto, auth: true, token: accessToken });
  },

  async completeSignup(req, res, next) {
    const donationSchema = Joi.object({
      phoneNumber: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().pattern(passwordPattern).required(),
      confirmPassword: Joi.ref("password"),
    });

    const { error } = donationSchema.validate(req.body);

    // 2. if error in validation -> return error via middleware
    if (error) {
      return next(error);
    }

    const { password, email, phoneNumber } = req.body;

    const userId = req.query.id;
    const existingUser = await Donation.findById(userId);

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
      donation: existingUser,
    });
  },

  async updateProfile(req, res, next) {
    const donationSchema = Joi.object({
      companyName: Joi.string(),
      companyLicenseNo: Joi.string(),
      companyEmergencyNo: Joi.string(),
      OwnerName: Joi.string(),
      cnicOrPassportNo: Joi.string(),
      companyAddress: Joi.string(),
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
      licenseImage: Joi.string(),
      cnicImage: Joi.string(),
      taxFileImage: Joi.string(),
    });

    const { error } = donationSchema.validate(req.body);

    if (error) {
      return next(error);
    }
    const {
      companyName,
      companyLicenseNo,
      companyEmergencyNo,
      OwnerName,
      cnicOrPassportNo,
      companyAddress,
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
      licenseImage,
      cnicImage,
      taxFileImage,
    } = req.body;
    const donationId = req.user._id;

    const donation = await Donation.findById(donationId);

    if (!donation) {
      const error = new Error("Donation Company not found!");
      error.status = 404;
      return next(error);
    }

    if (currentPassword && password) {
      const match = await bcrypt.compare(currentPassword, donation.password);

      if (!match) {
        const error = {
          status: 401,
          message: "Invalid Password",
        };

        return next(error);
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      donation.password = hashedPassword;
    }

    // Update only the provided fields
    if (companyName) donation.companyName = companyName;
    if (companyLicenseNo) donation.companyLicenseNo = companyLicenseNo;
    if (companyEmergencyNo) donation.companyEmergencyNo = companyEmergencyNo;
    if (OwnerName) donation.OwnerName = OwnerName;
    if (cnicOrPassportNo) donation.cnicOrPassportNo = cnicOrPassportNo;
    if (companyAddress) donation.companyAddress = companyAddress;
    if (state) donation.state = state;
    if (phoneNumber) donation.phoneNumber = phoneNumber;
    if (website) donation.website = website;
    if (facebook) donation.facebook = facebook;
    if (twitter) donation.twitter = twitter;
    if (instagram) donation.instagram = instagram;
    if (incomeTaxNo) donation.incomeTaxNo = incomeTaxNo;
    if (salesTaxNo) donation.salesTaxNo = salesTaxNo;
    if (bankName) donation.bankName = bankName;
    if (accountHolderName) donation.accountHolderName = accountHolderName;
    if (accountNumber) donation.accountNumber = accountNumber;
    if (licenseImage) donation.licenseImage = licenseImage;
    if (cnicImage) donation.cnicImage = cnicImage;
    if (taxFileImage) donation.taxFileImage = taxFileImage;

    // Save the updated test
    await donation.save();

    return res.status(200).json({
      message: "Donation Company updated successfully",
      donation: donation,
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

      const donation = await Donation.findOne({ _id: id });

      const donationDto = new donationDTO(agency);

      return res.status(200).json({
        donation: donationDto,
        auth: true,
        accessToken: accessToken,
      });
    } catch (e) {
      return next(e);
    }
  },
};

module.exports = donationAuthController;
