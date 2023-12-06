const express = require("express");
const app = express();
const Doctor = require("../../models/Doctor/doctors.js");
const Hospital = require("../../models/Hospital/hospital.js");
const Department = require("../../models/Hospital/dapartment.js");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const departDTO = require("../../dto/department.js");
const JWTService = require("../../services/JWTService.js");
const RefreshToken = require("../../models/token.js");
const AccessToken = require("../../models/accessToken.js");
const VerificationCode = require("../../models/verificationCode.js");
const nodemailer = require("nodemailer");

const hospDocController = {
  async searchDoc(req, res, next) {
    try {
      const query = req.body.searchText;
      const regex = new RegExp(query, "i"); // Create a case-insensitive regular expression

      // Perform a case-insensitive search in the database
      const suggestions = await Doctor.find({ name: regex });

      res.json({ suggestions });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  async sendCodeToDocEmail(req, res, next) {
    const hospId = req.user._id;
    const userId = req.query.id;
    const user = await Doctor.findById(userId);
    const hospital = await Hospital.findById(hospId);
    if (!hospital) {
      const error = new Error("Hospital not found!");
      error.status = 404;
      return next(error);
    }
    if (!user) {
      const error = new Error("Doctor not found!");
      error.status = 404;
      return next(error);
    }
    const email = user.email;
    try {
      let code;
      var codeToSave = new VerificationCode({
        email: email,
        code: Math.floor(100000 + Math.random() * 900000),
      });
      code = codeToSave.save();

      // Send email (use credintials of SendGrid)
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "berryboostbb",
          pass: "wwdrzfmlrfjprypp",
        },
      });
      var mailOptions = {
        from: "no-reply@example.com",
        to: email,
        subject: "Account Verification",
        text:
          `You are being added by ${hospital.hospitalFirstName}` +
          " " +
          `${hospital.hospitalLastName}` +
          " " +
          "as a doctor in meditour dasshboard!\n" +
          "Your verification code is " +
          codeToSave.code +
          "\n\nThank You!\n",
      };
      transporter.sendMail(mailOptions, function (err) {
        if (err) {
          return next(err);
        }

        return res.status(200).json({
          status: true,
          message: ` A verification email has been sent to ${email}`,
        });
      });
    } catch (error) {
      return next(error);
    }
  },

  async confirmEmail(req, res, next) {
    try {
      const { code, email } = req.body;
      const hospitalId = req.user._id;
    //   console.log(hospitalId)
  
      const cod = await VerificationCode.findOne({ code: code });
  
      if (!cod) {
        const error = new Error(
          "Incorrect verification code. Please double-check the code and try again."
        );
        error.status = 400;
        return next(error);
      }
  
      if (email == cod.email) {
        const user = await Doctor.findOne({ email: email });
  
        if (!user) {
          return res.status(200).json({
            status: true,
            message:
              "We were unable to find a user for this verification. Please enter the correct email!",
          });
        }
  
        // Check if the hospitalId is not already in the array before pushing
        if (!user.hospitalIds.includes(hospitalId)) {
          user.hospitalIds.push(hospitalId);
          await user.save(); // Await the save operation
  
          return res.status(200).json({
            status: true,
            message: "Your account has been successfully verified",
          });
        } else {
          return res.status(200).json({
            status: true,
            message: "This hospital is already associated with the user.",
          });
        }
      } else {
        return res.status(200).json({
          status: true,
          message:
            "We were unable to find a user for this verification. Please enter the correct email!",
        });
      }
    } catch (error) {
      return next(error);
    }
  }
  
  
};
module.exports = hospDocController;
