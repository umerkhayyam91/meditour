const express = require("express");
const app = express();
const Pharmacy = require("../../models/Pharmacy/pharmacy.js");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const PharmDTO = require("../../dto/pharm.js");
const JWTService = require("../../services/JWTService.js");
const RefreshToken = require("../../models/token.js");
const AccessToken = require("../../models/accessToken.js");
const LabDTO = require("../../dto/lab.js")

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;

const pharmAuthController = {
  async register(req, res, next) {
    const pharmRegisterSchema = Joi.object({
      pharmImage: Joi.string().required(),
      ownerImage: Joi.string().required(),
      taxFileImage: Joi.string().required(),
      pharmFirstName: Joi.string().required(),
      pharmLastName: Joi.string().required(),
      pharmLicenseNumber: Joi.string().required(),
      licenceExpiryDate: Joi.string().required(),
      OwnerFirstName: Joi.string().required(),
      OwnerMiddleName: Joi.string().required(),
      OwnerLastName: Joi.string().required(),
      cnicOrPassportNo: Joi.string().required(),
      cnicOrPassportExpiry: Joi.string().required(),
      pharmAddress: Joi.string().required(),
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
      pharmFirstName,
      pharmLastName,
      pharmLicenseNumber,
      licenceExpiryDate,
      OwnerFirstName,
      OwnerMiddleName,
      OwnerLastName,
      cnicOrPassportNo,
      cnicOrPassportExpiry,
      pharmAddress,
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
      pharmImage,
      ownerImage,
      taxFileImage,
    } = req.body;

    let accessToken;
    let refreshToken;

    let pharm;
    try {
      const pharmToRegister = new Pharmacy({
        pharmFirstName,
        pharmLastName,
        pharmLicenseNumber,
        licenceExpiryDate,
        OwnerFirstName,
        OwnerMiddleName,
        OwnerLastName,
        cnicOrPassportNo,
        cnicOrPassportExpiry,
        pharmAddress,
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
        pharmImage,
        ownerImage,
        taxFileImage,
      });

      pharm = await pharmToRegister.save();

      // token generation
      accessToken = JWTService.signAccessToken({ _id: pharm._id }, "365d");

      refreshToken = JWTService.signRefreshToken({ _id: pharm._id }, "365d");
    } catch (error) {
      return next(error);
    }

    // store refresh token in db
    await JWTService.storeRefreshToken(refreshToken, pharm._id);
    await JWTService.storeAccessToken(accessToken, pharm._id);

    // send tokens in cookie
    // res.cookie("accessToken", accessToken, {
    //   maxAge: 1000 * 60 * 60 * 24,
    //   httpOnly: true,
    // });

    // res.cookie("refreshToken", refreshToken, {
    //   maxAge: 1000 * 60 * 60 * 24,
    //   httpOnly: true,
    // });

    // 6. response send

    const pharmDTO = new PharmDTO(pharm);

    return res
      .status(201)
      .json({ pharmacy: pharmDTO, auth: true, token: accessToken });
  },

  async login(req, res, next) {
    const pharmLoginSchema = Joi.object({
      email: Joi.string().min(5).max(30).required(),
      password: Joi.string().pattern(passwordPattern),
    });

    const { error } = pharmLoginSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { email, password } = req.body;

    let pharm;

    try {
      // match username
      pharm = await Pharmacy.findOne({ email: email });
      if (!pharm) {
        const error = {
          status: 401,
          message: "Invalid email",
        };

        return next(error);
      }
      if (pharm.isVerified == false) {
        const error = {
          status: 401,
          message: "User not verified",
        };

        return next(error);
      }

      

      // match password

      const match = await bcrypt.compare(password, pharm.password);

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

    const accessToken = JWTService.signAccessToken({ _id: pharm._id }, "365d");
    const refreshToken = JWTService.signRefreshToken({ _id: pharm._id }, "365d");
    // update refresh token in database
    try {
      await RefreshToken.updateOne(
        {
          userId: pharm._id,
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
          userId: pharm._id,
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

    const pharmDTO = new PharmDTO(pharm);

    return res
      .status(200)
      .json({ pharm: pharmDTO, auth: true, token: accessToken });
  },

  async completeSignup(req, res, next) {
    const pharmRegisterSchema = Joi.object({
      phoneNumber: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().pattern(passwordPattern).required(),
      confirmPassword: Joi.ref("password"),
    });

    const { error } = pharmRegisterSchema.validate(req.body);

    // 2. if error in validation -> return error via middleware
    if (error) {
      return next(error);
    }

    const { password, email, phoneNumber } = req.body;

    const userId = req.query.id;
    const existingUser = await Pharmacy.findById(userId);

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
      .json({ message: "User updated successfully", pharmacy: existingUser });
  },

  async updateProfile(req, res, next) {
    const pharmSchema = Joi.object({
      website: Joi.string(),
      twitter: Joi.string(),
      facebook: Joi.string(),
      instagram: Joi.string(),
      bankName: Joi.string(),
      accountHolderName: Joi.string(),
      accountNumber: Joi.string(),
    });

    const { error } = pharmSchema.validate(req.body);

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
    const pharmId = req.user._id;

    const pharm = await Pharmacy.findById(pharmId);

    if (!pharm) {
      const error = new Error("Pharmacy not found!");
      error.status = 404;
      return next(error);
    }

    // Update only the provided fields
    if (website) pharm.website = website;
    if (facebook) pharm.facebook = facebook;
    if (twitter) pharm.twitter = twitter;
    if (instagram) pharm.instagram = instagram;
    if (bankName) pharm.bankName = bankName;
    if (accountHolderName) pharm.accountHolderName = accountHolderName;
    if (accountNumber) pharm.accountNumber = accountNumber;

    // Save the updated test
    await pharm.save();

    return res
      .status(200)
      .json({ message: "Pharmacy updated successfully", Pharmacy: pharm });
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
      console.log(accessId)
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
      const pharm = await Pharmacy.findOne({ _id: id });
  
      const pharmDto = new PharmDTO(pharm);
  
      return res.status(200).json({ pharm: pharmDto, auth: true, accessToken: accessToken });
    } catch (e) {
      return next(e);
    }

  },
};

module.exports = pharmAuthController;
