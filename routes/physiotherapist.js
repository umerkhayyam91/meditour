const express = require("express");
const physioAuthController = require("../controller/Physiotherapist/physioAuthController");
const VerificationController = require("../controller/verificationController");
const docAvailabilityController = require("../controller/Doctor/doctorAvailabilityController")
const docAppointController = require("../controller/Doctor/doctorAppointController")
const auth = require('../middlewares/auth');
const uploadFileController = require("../controller/uploadFileController");
const multer = require("multer");
const router = express.Router();
const upload = multer({ dest: "temp/" });


//............auth...............
router.post("/physio/register", physioAuthController.register);
router.post("/physio/login", physioAuthController.login);
router.post("/physio/uploadFile", upload.single("file"), uploadFileController.uploadFile);
router.post("/physio/completeSignup", physioAuthController.completeSignup);
router.put("/physio/updateProfile", auth, physioAuthController.updateProfile);
router.post("/physio/logout", auth, physioAuthController.logout);
router.post("/physio/refresh", auth, physioAuthController.refresh);


//..............verification.........
router.post("/physio/sendCodeToEmail", VerificationController.sendCodeToEmail);
router.post("/physio/confirmEmail", VerificationController.confirmEmail);
router.post("/physio/ResetLink", VerificationController.ResetLink);
router.post("/physio/resetPassword", VerificationController.resetPassword);

module.exports = router;
 