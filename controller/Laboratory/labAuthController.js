const express = require("express");
const app = express();
const Laboratory = require("../../models/Laboratory/laboratory.js");
const multer = require("multer");
const fs = require("fs");
const admin = require("firebase-admin");
const serviceAccount = require("../../serviceAccountKey.json");
const bodyParser = require("body-parser");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const LabDTO = require("../../dto/lab.js");
const JWTService = require("../../services/JWTService.js");
const RefreshToken = require("../../models/token.js");
// const nodemailer = require("nodemailer");

app.use(
  bodyParser.urlencoded({
    limit: "5000mb",
    extended: true,
    parameterLimit: 100000000000,
  })
);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://meditour-33ba8.appspot.com",
});
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;

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

    try {
      // Inside your try-catch block
      const emailInUse = await Laboratory.exists({ email });

      if (emailInUse) {
        const error = new Error("Email already registered, use another email!");
        error.status = 409;
        return next(error);
      }
    } catch (error) {
      return next(error);
    }

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
  // async register(req, res) {
  //     try {

  // const { labFirstName, labLastName, labLicenseNumber, labExpiryDate, OwnerFirstName, OwnerMiddleName, OwnerLastName,
  //     cnicOrPassportNo, cnicOrPassportExpiry, labAddress, state, country, website,
  //     twitter, facebook, instagram, incomeTaxNo,
  //     salesTaxNo, bankName, accountHolderName, accountName } = req.body;

  //         if (!labFirstName, !labLastName, !labLicenseNumber, !labExpiryDate, !OwnerFirstName, !OwnerMiddleName, !OwnerLastName,
  //             !cnicOrPassportNo, !cnicOrPassportExpiry, !labAddress, !state, !country, !website,
  //             !twitter, !facebook, !instagram, !incomeTaxNo,
  //             !salesTaxNo, !bankName, !accountHolderName, !accountName) {
  //             return res.status(401).json({
  //                 status: "failure",
  //                 message: 'Please enter the required credentials'
  //             });
  //         }
  //         // const userId = req.user.id;

  //         // const labLogoUpload = req.files['labLogo'] !== undefined && req.files['labLogo'].length > 0;
  //         // const isMultipleFileUpload = req.files['images'] !== undefined && req.files['images'].length > 0;

  //         const newLab = new Lab({
  //             labFirstName, labLastName, labLicenseNumber, labExpiryDate, OwnerFirstName, OwnerMiddleName, OwnerLastName,
  //             cnicOrPassportNo, cnicOrPassportExpiry, labAddress, state, country, website,
  //             twitter, facebook, instagram, incomeTaxNo,
  //             salesTaxNo, bankName, accountHolderName, accountName
  //         });
  //         await newLab.save();

  //         // if (labLogoUpload) {
  //         //     const propertyDocumentFile = req.files['labLogoUpload'][0];
  //         //     const file = fs.readFileSync(propertyDocumentFile.path);
  //         //     const imageRef = bucket.file(`labLogoUploads/${userId}/${propertyDocumentFile.originalname}`);

  //         //     await new Promise((resolve, reject) => {
  //         //         bucket.upload(propertyDocumentFile.path, {
  //         //             destination: imageRef,
  //         //             metadata: {
  //         //                 contentType: propertyDocumentFile.mimetype,
  //         //             },
  //         //         })
  //         //             .then(() => {
  //         //                 fs.unlinkSync(propertyDocumentFile.path);
  //         //                 resolve();
  //         //             })
  //         //             .catch((error) => {
  //         //                 console.error('Error uploading labLogoUpload:', error);
  //         //                 reject(error);
  //         //             });
  //         //     });

  //         //     // Get the public URL of the uploaded document
  //         //     const documentUrl = await imageRef.getSignedUrl({
  //         //         action: 'read',
  //         //         expires: '01-01-3000',
  //         //     });

  //         //     // Update the labLogoUpload URL in the newPoster object
  //         //     newPoster.labLogoUpload = documentUrl[0];
  //         // }

  //         // const imagesFiles = req.files['images']
  //         // // Wait for all image uploads to complete
  //         // await Promise.all(
  //         //     imagesFiles.map((imageFile) =>
  //         //         new Promise((resolve, reject) => {
  //         //             const imageRef = bucket.file(`residence_images/${userId}/${imageFile.originalname}`);
  //         //             bucket.upload(imageFile.path, {
  //         //                 destination: imageRef,
  //         //                 metadata: {
  //         //                     contentType: imageFile.mimetype
  //         //                 },
  //         //             })
  //         //                 .then(() => {
  //         //                     fs.unlinkSync(imageFile.path);
  //         //                     // Get the public URL of the uploaded image
  //         //                     return imageRef.getSignedUrl({
  //         //                         action: 'read',
  //         //                         expires: '01-01-3000',
  //         //                     });
  //         //                 })
  //         //                 .then((signedUrls) => {
  //         //                     // Add the image URL to the 'images' array in the newPoster object
  //         //                     newPoster.images.push(signedUrls[0]);
  //         //                     resolve();
  //         //                 })
  //         //                 .catch((error) => {
  //         //                     console.error('Error uploading an image:', error);
  //         //                     reject(error);
  //         //                 });
  //         //         })
  //         //     )
  //         // );

  //         // Save the newPoster object to the database
  //         // await newPoster.save();

  //         return res.status(200).json({ newLab });

  //     } catch (error) {
  //         // Handle errors
  //         return res.json({
  //             'status': 'failure',
  //             'message': error.message,
  //         });
  //     }
  // },

  async labLogo(req, res) {
    console.log(req);
    const id = req.body.userId;

    try {
      if (req.file) {
        const file = fs.readFileSync(req.file.path);
        const imageRef = bucket.file(
          `profile_pictures/${req.file.originalname}`
        );

        bucket
          .upload(req.file.path, {
            destination: imageRef,
            metadata: {
              contentType: req.file.mimetype,
            },
          })
          .then(() => {
            // Delete the local file after uploading
            fs.unlinkSync(req.file.path);

            // Get the public URL of the uploaded image
            imageRef
              .getSignedUrl({
                action: "read",
                expires: "01-01-3000", // Set an expiration date if needed
              })
              .then((signedUrls) => {
                const imageUrl = signedUrls[0];
                return res
                  .status(200)
                  .json({
                    message: "File added successfully",
                    imageUrl: imageUrl,
                  })
                  .catch((error) => {
                    console.error("Error updating user:", error);
                    return res.status(500).send("Error updating user.");
                  });
              })
              .catch((error) => {
                console.error("Error getting signed URL:", error);
                return res.status(500).send("Error getting signed URL.");
              });
          })
          .catch((error) => {
            console.error("Error uploading image:", error);
            return res.status(500).send("Error uploading image.");
          });
      } else {
        res.status(500).json({
          status: "Failure",
          error: "image not given",
        });
      }
    } catch (error) {
      res.status(500).json({
        status: "Failure",
        error: error.message,
      });
    }
  },

  async login(req, res, next) {
    // 1. validate user input
    // 2. if validation error, return error
    // 3. match username and password
    // 4. return response

    // we expect input data to be in such shape
    const labLoginSchema = Joi.object({
      email: Joi.string().min(5).max(30).required(),
      password: Joi.string().pattern(passwordPattern),
    });

    const { error } = labLoginSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    const { email, password } = req.body;

    // const username = req.body.username
    // const password = req.body.password

    let lab;

    try {
      // match username
      lab = await Laboratory.findOne({ email: email });

      if (!lab) {
        const error = {
          status: 401,
          message: "Invalid email",
        };

        return next(error);
      }

      // match password

      const match = await bcrypt.compare(password, lab.password);

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

    const accessToken = JWTService.signAccessToken({ _id: lab._id }, "30m");
    const refreshToken = JWTService.signRefreshToken({ _id: lab._id }, "60m");

    // update refresh token in database
    try {
      await RefreshToken.updateOne(
        {
          _id: lab._id,
        },
        { token: refreshToken },
        { upsert: true }
      );
    } catch (error) {
      return next(error);
    }

    res.cookie("accessToken", accessToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });

    const labDto = new LabDTO(lab);

    return res
      .status(200)
      .json({ lab: labDto, auth: true, token: accessToken });
  },
};
module.exports = labAuthController;
