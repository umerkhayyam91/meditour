const express = require("express");
const paramedicAuthController = require("../controller/Paramedic/paramedicAuthController");
const VerificationController = require("../controller/verificationController");
const docAvailabilityController = require("../controller/Doctor/doctorAvailabilityController")
const docAppointController = require("../controller/Doctor/doctorAppointController")
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


//..............verification.........
router.post("/paramedic/sendCodeToEmail", VerificationController.sendCodeToEmail);
router.post("/paramedic/confirmEmail", VerificationController.confirmEmail);
router.post("/paramedic/ResetLink", VerificationController.ResetLink);
router.post("/paramedic/resetPassword", VerificationController.resetPassword);

module.exports = router;
 