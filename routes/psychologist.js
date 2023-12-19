const express = require("express");
const psychologistAuthController = require("../controller/Psychologist/psychologistAuthController");
const VerificationController = require("../controller/verificationController");
const psychologistAvailabilityController = require("../controller/Psychologist/psychologistAvailabilityController")
const psychologistAppointController = require("../controller/Psychologist/psychologistAppointController")
const auth = require('../middlewares/auth');
const uploadFileController = require("../controller/uploadFileController");
const multer = require("multer");
const router = express.Router();
const upload = multer({ dest: "temp/" });


//............auth...............
router.post("/psychologist/register", psychologistAuthController.register);
router.post("/psychologist/login", psychologistAuthController.login);
router.post("/psychologist/uploadFile", upload.single("file"), uploadFileController.uploadFile);
router.post("/psychologist/completeSignup", psychologistAuthController.completeSignup);
router.put("/psychologist/updateProfile", auth, psychologistAuthController.updateProfile);
router.post("/psychologist/logout", auth, psychologistAuthController.logout);
router.post("/psychologist/refresh", auth, psychologistAuthController.refresh);

//............availability............
router.post("/psychologist/addAvailability", auth, psychologistAvailabilityController.addAvailability);
router.get("/psychologist/getAvailability", auth, psychologistAvailabilityController.getAvailability);

//............appointments..............
router.get("/psychologist/getAllAppointments", auth, psychologistAppointController.getAllAppointments);
router.get("/psychologist/getAllPatients", auth, psychologistAppointController.getAllPatients);
router.get("/psychologist/patientHistory", auth, psychologistAppointController.patientHistory);
router.get("/psychologist/getRequests", auth, psychologistAppointController.getRequests);


//..............verification.........
router.post("/psychologist/sendCodeToEmail", VerificationController.sendCodeToEmail);
router.post("/psychologist/confirmEmail", VerificationController.confirmEmail);
router.post("/psychologist/ResetLink", VerificationController.ResetLink);
router.post("/psychologist/resetPassword", VerificationController.resetPassword);

module.exports = router;
 