const express = require("express");
const psychologistAuthController = require("../controller/Psychologist/psychologistAuthController");
const VerificationController = require("../controller/verificationController");
const docAvailabilityController = require("../controller/Doctor/doctorAvailabilityController")
const docAppointController = require("../controller/Doctor/doctorAppointController")
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


//..............verification.........
router.post("/psychologist/sendCodeToEmail", VerificationController.sendCodeToEmail);
router.post("/psychologist/confirmEmail", VerificationController.confirmEmail);
router.post("/psychologist/ResetLink", VerificationController.ResetLink);
router.post("/psychologist/resetPassword", VerificationController.resetPassword);

module.exports = router;
 