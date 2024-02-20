const express = require("express");
const app = express();
const Paramedic = require("../../models/Paramedic/paramedic.js");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const ParamedicDTO = require("../../dto/paramedic.js");
const JWTService = require("../../services/JWTService.js");
const RefreshToken = require("../../models/token.js");
const AccessToken = require("../../models/accessToken.js");

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;

const docAuthController = {
  async register(req, res, next) {
    const docRegisterSchema = Joi.object({
      name: Joi.string().required(),
      cnicOrPassportNo: Joi.string().required(),
      qualification: Joi.string().required(),
      speciality: Joi.string().required(),
      services: Joi.string().required(),
      loc: Joi.array().required(),
      clinicName: Joi.string().required(),
      clinicAddress: Joi.string().required(),
      clinicExperiences: Joi.string().required(),
      pmdcNumber: Joi.string().required(),
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
      doctorImage: Joi.string(),
      cnicImage: Joi.string(),
      clinicLogo: Joi.string(),
      pmdcImage: Joi.string(),
      taxFileImage: Joi.string(),
    });

    const { error } = docRegisterSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const {
      name,
      loc,
      cnicOrPassportNo,
      qualification,
      speciality,
      services,
      clinicName,
      clinicAddress,
      clinicExperiences,
      pmdcNumber,
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
      doctorImage,
      cnicImage,
      clinicLogo,
      pmdcImage,
      taxFileImage
    } = req.body;

    let accessToken;
    let refreshToken;

    let doc;
    try {
      const docToRegister = new Paramedic({
        loc,
        name,
        cnicOrPassportNo,
        qualification,
        speciality,
        services,
        clinicName,
        clinicAddress,
        clinicExperiences,
        pmdcNumber,
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
        doctorImage,
        cnicImage,
        clinicLogo,
        pmdcImage,
        taxFileImage
      });

      doc = await docToRegister.save();

      // token generation
      accessToken = JWTService.signAccessToken({ _id: doc._id }, "365d");

      refreshToken = JWTService.signRefreshToken({ _id: doc._id }, "365d");
    } catch (error) {
      return next(error);
    }

    // store refresh token in db
    await JWTService.storeRefreshToken(refreshToken, doc._id);
    await JWTService.storeAccessToken(accessToken, doc._id);

    // 6. response send

    // const docDto = new doctorDto(doc);

    return res
      .status(201)
      .json({ paramedic: doc, auth: true, token: accessToken });
  },

  async login(req, res, next) {
    const docLoginSchema = Joi.object({
      email: Joi.string().min(5).max(30).required(),
      password: Joi.string().pattern(passwordPattern),
    });

    const { error } = docLoginSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { email, password } = req.body;

    let doc;

    try {
      // match username
      const emailRegex = new RegExp(email, "i");
      doc = await Paramedic.findOne({ email: { $regex: emailRegex } });
      if (!doc) {
        const error = {
          status: 401,
          message: "Invalid email",
        };

        return next(error);
      }
      if (doc.isVerified == false) {
        const error = {
          status: 401,
          message: "User not verified",
        };

        return next(error);
      }

      // match password

      const match = await bcrypt.compare(password, doc.password);

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

    const accessToken = JWTService.signAccessToken({ _id: doc._id }, "365d");
    const refreshToken = JWTService.signRefreshToken({ _id: doc._id }, "365d");
    // update refresh token in database
    try {
      await RefreshToken.updateOne(
        {
          userId: doc._id,
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
          userId: doc._id,
        },
        { token: accessToken },
        { upsert: true }
      );
    } catch (error) {
      return next(error);
    }

    const paramedic = new ParamedicDTO(doc);

    return res
      .status(200)
      .json({ paramedic : paramedic, auth: true, token: accessToken });
  },

  async completeSignup(req, res, next) {
    const docRegisterSchema = Joi.object({
      phoneNumber: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().pattern(passwordPattern).required(),
      confirmPassword: Joi.ref("password"),
    });

    const { error } = docRegisterSchema.validate(req.body);

    // 2. if error in validation -> return error via middleware
    if (error) {
      return next(error);
    }

    const { password, email, phoneNumber } = req.body;

    const userId = req.query.id;
    const existingUser = await Paramedic.findById(userId);

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
      .json({ message: "User updated successfully", paramedic: existingUser });
  },

  async updateProfile(req, res, next) {
    const docSchema = Joi.object({
      name: Joi.string(),
      cnicOrPassportNo: Joi.string(),
      loc: Joi.array().required(),
      qualification: Joi.string(),
      speciality: Joi.string(),
      services : Joi.string(),
      clinicName : Joi.string(),
      clinicAddress : Joi.string(),
      clinicExperiences : Joi.string(),
      pmdcNumber : Joi.string(),
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
      doctorImage: Joi.string(),
      cnicImage: Joi.string(),
      pmdcImage: Joi.string(),
      taxFileImage: Joi.string(),
    });

    const { error } = docSchema.validate(req.body);

    if (error) {
      return next(error);
    }
    const {
      loc,
      name,
      cnicOrPassportNo,
      qualification,
      speciality,
      services ,
      clinicName ,
      clinicAddress ,
      clinicExperiences ,
      pmdcNumber ,
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
      doctorImage,
      cnicImage,
      pmdcImage,
      taxFileImage,
    } = req.body;
    const docId = req.user._id;

    const doc = await Paramedic.findById(docId);

    if (!doc) {
      const error = new Error("Doctor not found!");
      error.status = 404;
      return next(error);
    }

    if (currentPassword && password) {
      const match = await bcrypt.compare(currentPassword, doc.password);

      if (!match) {
        const error = {
          status: 401,
          message: "Invalid Password",
        };

        return next(error);
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      doc.password = hashedPassword;
    }

    // Update only the provided fields
    if (name) doc.name = name;
    if (cnicOrPassportNo) doc.cnicOrPassportNo = cnicOrPassportNo;
    if(loc) doc.loc = loc;
    if (qualification) doc.qualification = qualification;
    if (speciality) doc.speciality = speciality;
    if (services) doc.services = services;
    if (clinicName) doc.clinicName = clinicName;
    if (clinicAddress) doc.clinicAddress = clinicAddress;
    if (clinicExperiences) doc.clinicExperiences = clinicExperiences;
    if (pmdcNumber) doc.pmdcNumber = pmdcNumber;
    if (emergencyNo) doc.emergencyNo = emergencyNo;
    if (state) doc.state = state;
    if (phoneNumber) doc.phoneNumber = phoneNumber;
    if (website) doc.website = website;
    if (facebook) doc.facebook = facebook;
    if (twitter) doc.twitter = twitter;
    if (instagram) doc.instagram = instagram;
    if (incomeTaxNo) doc.incomeTaxNo = incomeTaxNo;
    if (salesTaxNo) doc.salesTaxNo = salesTaxNo;
    if (bankName) doc.bankName = bankName;
    if (accountHolderName) doc.accountHolderName = accountHolderName;
    if (accountNumber) doc.accountNumber = accountNumber;
    if (doctorImage) doc.doctorImage = doctorImage;
    if (cnicImage) doc.cnicImage = cnicImage;
    if (pmdcImage) doc.pmdcImage = pmdcImage;
    if (taxFileImage) doc.taxFileImage = taxFileImage;

    // Save the updated test
    await doc.save();

    return res
      .status(200)
      .json({ message: "Doctor updated successfully", paramedic: doc });
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
      await RefreshToken.updateOne({ userId: id }, { token: refreshToken });
      await AccessToken.updateOne({ userId: accessId }, { token: accessToken });

      const doc = await Paramedic.findOne({ _id: id });

      const doctorDTO = new ParamedicDTO(doc);

      return res
        .status(200)
        .json({ paramedic: doctorDTO, auth: true, accessToken: accessToken });
    } catch (e) {
      return next(e);
    }
  },
};

module.exports = docAuthController;
