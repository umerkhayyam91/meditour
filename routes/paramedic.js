const express = require("express");
const paramedicAuthController = require("../controller/Paramedic/paramedicAuthController");
const VerificationController = require("../controller/verificationController");
const paramedicAvailabilityController = require("../controller/Paramedic/paramedicAvailabilityController")
const paramedicAppointController = require("../controller/Paramedic/paramedicAppointController")
const auth = require('../middlewares/auth');
const uploadFileController = require("../controller/uploadFileController");
const multer = require("multer");
const router = express.Router();
const upload = multer({ dest: "temp/" });


//............auth...............
router.post("/paramedic/register", paramedicAuthController.register);
router.post("/paramedic/login", paramedicAuthController.login);
router.post("/paramedic/uploadFile", upload.single("file"), uploadFileController.uploadFile);
router.post("/paramedic/completeSignup", paramedicAuthController.completeSignup);
router.put("/paramedic/updateProfile", auth, paramedicAuthController.updateProfile);
router.post("/paramedic/logout", auth, paramedicAuthController.logout);
router.post("/paramedic/refresh", auth, paramedicAuthController.refresh);

//............availability............
router.post("/paramedic/addAvailability", auth, paramedicAvailabilityController.addAvailability);
router.get("/paramedic/getAvailability", auth, paramedicAvailabilityController.getAvailability);

//............appointments..............
router.get("/paramedic/getAllAppointments", auth, paramedicAppointController.getAllAppointments);
router.get("/paramedic/getAllPatients", auth, paramedicAppointController.getAllPatients);
router.get("/paramedic/patientHistory", auth, paramedicAppointController.patientHistory);
router.get("/paramedic/getRequests", auth, paramedicAppointController.getRequests);


//..............verification.........
router.post("/paramedic/sendCodeToEmail", VerificationController.sendCodeToEmail);
router.post("/paramedic/confirmEmail", VerificationController.confirmEmail);
router.post("/paramedic/ResetLink", VerificationController.ResetLink);
router.post("/paramedic/resetPassword", VerificationController.resetPassword);

module.exports = router;
