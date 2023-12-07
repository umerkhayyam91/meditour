const express = require("express");
const app = express();
const Hospital = require("../../models/Hospital/hospital.js");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const HospDTO = require("../../dto/hospital.js");
const JWTService = require("../../services/JWTService.js");
const RefreshToken = require("../../models/token.js");
const AccessToken = require("../../models/accessToken.js");
const LabDTO = require("../../dto/lab.js");

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;

const hospAuthController = {
  async register(req, res, next) {
    const pharmRegisterSchema = Joi.object({
      hospitalLogo: Joi.string().required(),
      pmdcImage: Joi.string().required(),
      taxFileImage: Joi.string().required(),
      cnicImage: Joi.string().required(),
      hospitalFirstName: Joi.string().required(),
      hospitalLastName: Joi.string().required(),
      pmdcNumber: Joi.string().required(),
      pmdcExpiryDate: Joi.string().required(),
      authFirstName: Joi.string().required(),
      authMiddleName: Joi.string().required(),
      authLastName: Joi.string().required(),
      cnicOrPassportNo: Joi.string().required(),
      cnicOrPassportExpiry: Joi.string().required(),
      hospitalAddress: Joi.string().required(),
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
    });

    const { error } = pharmRegisterSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const {
        hospitalLogo,
        pmdcImage,
        taxFileImage,
        cnicImage,
        hospitalFirstName,
        hospitalLastName,
        pmdcNumber,
        pmdcExpiryDate,
        authFirstName,
        authMiddleName,
        authLastName,
        cnicOrPassportNo,
        cnicOrPassportExpiry,
        hospitalAddress,
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
        accountNumber
    } = req.body;

    let accessToken;
    let refreshToken;

    let hospital;
    try {
      const hospToRegister = new Hospital({
        hospitalLogo,
        pmdcImage,
        taxFileImage,
        cnicImage,
        hospitalFirstName,
        hospitalLastName,
        pmdcNumber,
        pmdcExpiryDate,
        authFirstName,
        authMiddleName,
        authLastName,
        cnicOrPassportNo,
        cnicOrPassportExpiry,
        hospitalAddress,
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
        accountNumber
      });

      hospital = await hospToRegister.save();

      // token generation
      accessToken = JWTService.signAccessToken({ _id: hospital._id }, "365d");

      refreshToken = JWTService.signRefreshToken({ _id: hospital._id }, "365d");
    } catch (error) {
      return next(error);
    }

    // store refresh token in db
    await JWTService.storeRefreshToken(refreshToken, hospital._id);
    await JWTService.storeAccessToken(accessToken, hospital._id);


    // const hospDto = new HospDTO(hospital);

    return res
      .status(201)
      .json({ Hospital: hospital, auth: true, token: accessToken });
  },

  async login(req, res, next) {
    const hospLoginSchema = Joi.object({
      email: Joi.string().min(5).max(30).required(),
      password: Joi.string().pattern(passwordPattern),
    });

    const { error } = hospLoginSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { email, password } = req.body;

    let hosp;

    try {
      // match username
      hosp = await Hospital.findOne({ email: email });
      if (!hosp) {
        const error = {
          status: 401,
          message: "Invalid email",
        };

        return next(error);
      }
      if (hosp.isVerified == false) {
        const error = {
          status: 401,
          message: "User not verified",
        };

        return next(error);
      }

      // match password

      const match = await bcrypt.compare(password, hosp.password);

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

    const accessToken = JWTService.signAccessToken({ _id: hosp._id }, "365d");
    const refreshToken = JWTService.signRefreshToken(
      { _id: hosp._id },
      "365d"
    );
    // update refresh token in database
    try {
      await RefreshToken.updateOne(
        {
          userId: hosp._id,
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
          userId: hosp._id,
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

    const hospDto = new HospDTO(hosp);

    return res
      .status(200)
      .json({ Hospital: hospDto, auth: true, token: accessToken });
  },

  async completeSignup(req, res, next) {
    const hospRegisterSchema = Joi.object({
      phoneNumber: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().pattern(passwordPattern).required(),
      confirmPassword: Joi.ref("password"),
    });

    const { error } = hospRegisterSchema.validate(req.body);

    // 2. if error in validation -> return error via middleware
    if (error) {
      return next(error);
    }

    const { password, email, phoneNumber } = req.body;

    const userId = req.query.id;
    const existingUser = await Hospital.findById(userId);

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
      .json({ message: "User updated successfully", hospital: existingUser });
  },

  async updateProfile(req, res, next) {
    const hospSchema = Joi.object({
      website: Joi.string(),
      twitter: Joi.string(),
      facebook: Joi.string(),
      instagram: Joi.string(),
      bankName: Joi.string(),
      accountHolderName: Joi.string(),
      accountNumber: Joi.string(),
    });

    const { error } = hospSchema.validate(req.body);

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
    const hospId = req.user._id;

    const hosp = await Pharmacy.findById(hospId);

    if (!hosp) {
      const error = new Error("Hospital not found!");
      error.status = 404;
      return next(error);
    }

    // Update only the provided fields
    if (website) hosp.website = website;
    if (facebook) hosp.facebook = facebook;
    if (twitter) hosp.twitter = twitter;
    if (instagram) hosp.instagram = instagram;
    if (bankName) hosp.bankName = bankName;
    if (accountHolderName) hosp.accountHolderName = accountHolderName;
    if (accountNumber) hosp.accountNumber = accountNumber;

    // Save the updated test
    await hosp.save();

    return res
      .status(200)
      .json({ message: "Hospital updated successfully", Hospital: hosp });
  },

  async logout(req, res, next) {
    // 1. delete refresh token from db
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader && authHeader.split(" ")[1];
    const refreshToken = authHeader && authHeader.split(" ")[2];
    // console.log("object");
    // console.log(accessToken);
    // console.log(refreshToken);
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
      const hosp = await Hospital.findOne({ _id: id });

      const hospDto = new HospDTO(hosp);

      return res
        .status(200)
        .json({ hospital: hospDto, auth: true, accessToken: accessToken });
    } catch (e) {
      return next(e);
    }
  },
};

module.exports = hospAuthController;
