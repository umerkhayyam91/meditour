const express = require("express");
const psychologistAuthController = require("../controller/Psychologist/psychologistAuthController");
const VerificationController = require("../controller/verificationController");
const psychologistAvailabilityController = require("../controller/Psychologist/psychologistAvailabilityController")
const psychologistAppointController = require("../controller/Psychologist/psychologistAppointController")
const psychologistDashController = require("../controller/Psychologist/psychologistDashController")
const generalRequestController = require("../controller/All Doctors Controllers/generalRequestController")
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

//............Dashboard.................
router.get("/psychologist/dashDetails", auth, psychologistDashController.dashDetails);
router.get("/psychologist/graph", auth, psychologistDashController.graph);

//............availability............
router.post("/psychologist/addAvailability", auth, psychologistAvailabilityController.addAvailability);
router.get("/psychologist/getAvailability", auth, psychologistAvailabilityController.getAvailability);

//............appointments..............
router.get("/psychologist/getAllAppointments", auth, psychologistAppointController.getAllAppointments);
router.get("/psychologist/getAllPatients", auth, psychologistAppointController.getAllPatients);
router.get("/psychologist/patientHistory", auth, psychologistAppointController.patientHistory);
router.get("/psychologist/getRequests", auth, psychologistAppointController.getRequests);

//.............Appointment Requests........................
router.get("/psychologist/getRequests", auth, generalRequestController.getRequests);
router.post("/psychologist/acceptRequest", auth, generalRequestController.acceptRequest);
router.delete("/psychologist/rejectRequest", auth, generalRequestController.rejectRequest);

//..............verification.........
router.post("/psychologist/sendCodeToEmail", VerificationController.sendCodeToEmail);
router.post("/psychologist/confirmEmail", VerificationController.confirmEmail);
router.post("/psychologist/ResetLink", VerificationController.ResetLink);
router.post("/psychologist/resetPassword", VerificationController.resetPassword);

module.exports = router;
 