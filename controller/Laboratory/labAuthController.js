const express = require("express");
const app = express();
const Laboratory = require("../../models/Laboratory/laboratory.js");
const serviceAccount = require("../../serviceAccountKey.json"); // Replace with your actual key file
const multer = require("multer");
const fs = require("fs");
const admin = require("firebase-admin");
const bodyParser = require("body-parser");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const LabDTO = require("../../dto/lab.js");
const JWTService = require("../../services/JWTService.js");
const RefreshToken = require("../../models/token.js");
// const nodemailer = require("nodemailer");

// app.use(
//   bodyParser.urlencoded({
//     limit: "5000mb",
//     extended: true,
//     parameterLimit: 100000000000,
//   })
// );

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "meditour-33ba8.appspot.com", // Replace with your actual storage bucket URL
});

const bucket = admin.storage().bucket();
// const upload = multer({ dest: 'temp/' })

const passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$/;

const labAuthController = {
  async register(req, res, next) {
    // 1. validate user input
    const labRegisterSchema = Joi.object({
      email: Joi.string().email().required(),
      labLogo: Joi.string().required(),
      labLicenseImage: Joi.string().required(),
      cnicImage: Joi.string().required(),
      taxFileImage: Joi.string().required(),
      phoneNumber: Joi.string().required(),
      password: Joi.string().pattern(passwordPattern).required(),
      confirmPassword: Joi.ref("password"),
      labFirstName: Joi.string().required(),
      labLastName: Joi.string().required(),
      labLicenseNumber: Joi.string().required(),
      labExpiryDate: Joi.string().required(),
      OwnerFirstName: Joi.string().required(),
      OwnerMiddleName: Joi.string().required(),
      OwnerLastName: Joi.string().required(),
      cnicOrPassportNo: Joi.string().required(),
      cnicOrPassportExpiry: Joi.string().required(),
      labAddress: Joi.string().required(),
      state: Joi.string().required(),
      website: Joi.string().required(),
      twitter: Joi.string().required(),
      facebook: Joi.string().required(),
      instagram: Joi.string().required(),
      incomeTaxNo: Joi.string().required(),
      salesTaxNo: Joi.string().required(),
      bankName: Joi.string().required(),
      accountHolderName: Joi.string().required(),
      accountName: Joi.string().required(),
      country: Joi.string().required(),
    });

    const { error } = labRegisterSchema.validate(req.body);

    // 2. if error in validation -> return error via middleware
    if (error) {
      return next(error);
    }

    // 3. if email or username is already registered -> return an error
    const {
      labFirstName,
      labLastName,
      labLicenseNumber,
      labExpiryDate,
      OwnerFirstName,
      OwnerMiddleName,
      OwnerLastName,
      cnicOrPassportNo,
      cnicOrPassportExpiry,
      labAddress,
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
      accountName,
      email,
      password,
      confirmPassword,
      phoneNumber,
      labLogo,
      labLicenseImage,
      taxFileImage,
      cnicImage,
    } = req.body;

    // try {
    //   // Inside your try-catch block
    //   const emailInUse = await Laboratory.exists({ email });

    //   if (emailInUse) {
    //     const error = new Error("Email already registered, use another email!");
    //     error.status = 409;
    //     return next(error);
    //   }
    // } catch (error) {
    //   return next(error);
    // }

    // 4. password hash
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. store user data in db
    let accessToken;
    let refreshToken;

    let lab;

    try {
      const labToRegister = new Laboratory({
        labFirstName,
        labLastName,
        labLicenseNumber,
        labExpiryDate,
        OwnerFirstName,
        OwnerMiddleName,
        OwnerLastName,
        cnicOrPassportNo,
        cnicOrPassportExpiry,
        labAddress,
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
        accountName,
        email,
        phoneNumber,
        labLogo,
        labLicenseImage,
        taxFileImage,
        cnicImage,
        password: hashedPassword,
      });

      lab = await labToRegister.save();

      // token generation
      accessToken = JWTService.signAccessToken({ _id: lab._id }, "30m");

      refreshToken = JWTService.signRefreshToken({ _id: lab._id }, "60m");
    } catch (error) {
      return next(error);
    }

    // store refresh token in db
    await JWTService.storeRefreshToken(refreshToken, lab._id);

    // send tokens in cookie
    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    // 6. response send

    const labDto = new LabDTO(lab);

    return res
      .status(201)
      .json({ lab: labDto, auth: true, token: accessToken });
  },

  async uploadFile(req, res) {
    try {
        if (req.file) {
          const file = fs.readFileSync(req.file.path);
          const imageRef = bucket.file(`profile_pictures/${req.file.originalname}`);

          bucket.upload(req.file.path, {
              destination: imageRef,
              metadata: {
                  contentType: req.file.mimetype,
              },
          })
            .then(() => {
              // Delete the local file after uploading
              fs.unlinkSync(req.file.path);
              
                    // Get the public URL of the uploaded image
                    imageRef.getSignedUrl({
                      action: 'read',
                      expires: '01-01-3000', // Set an expiration date if needed
                    })
                        .then((signedUrls) => {
                            const imageUrl = signedUrls[0];
                                    return res.status(200).json({
                                        fileUrl: imageUrl
                                    });
                                // })
                        })
                        .catch((error) => {
                            console.error('Error getting signed URL:', error);
                            return res.status(500).send('Error getting signed URL.');
                        });
                })
                .catch((error) => {
                    console.error('Error uploading image:', error);
                    return res.status(500).send('Error uploading image.');
                });
        } else {
          return res.send('Please select an image');
        }
    } catch (error) {
        res.status(500).json({
            status: 'Failure',
            error: error.message,
        });
    }
  },
};
module.exports = labAuthController;
