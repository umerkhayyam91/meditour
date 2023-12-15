const express = require("express");
const donationAuthController = require("../controller/Donation/donation");
const VerificationController = require("../controller/verificationController");
const auth = require('../middlewares/auth');
const uploadFileController = require("../controller/uploadFileController");
const multer = require("multer");
const router = express.Router();
const upload = multer({ dest: "temp/" });


//............auth...............
router.post("/donation/register", donationAuthController.register);
router.post("/donation/login", donationAuthController.login);
router.post("/donation/uploadFile", upload.single("file"), uploadFileController.uploadFile);
router.post("/donation/completeSignup", donationAuthController.completeSignup);
router.put("/donation/updateProfile", auth, donationAuthController.updateProfile);
router.post("/donation/logout", auth, donationAuthController.logout);
router.post("/donation/refresh", auth, donationAuthController.refresh);


//..............verification.........
router.post("/donation/sendCodeToEmail", VerificationController.sendCodeToEmail);
router.post("/donation/confirmEmail", VerificationController.confirmEmail);
router.post("/donation/ResetLink", VerificationController.ResetLink);
router.post("/donation/resetPassword", VerificationController.resetPassword);

module.exports = router;
