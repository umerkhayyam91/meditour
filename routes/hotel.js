const express = require("express");
const hotelAuthController = require("../controller/Hotel/hotel");
const VerificationController = require("../controller/verificationController");
const auth = require('../middlewares/auth');
const uploadFileController = require("../controller/uploadFileController");
const multer = require("multer");
const router = express.Router();
const upload = multer({ dest: "temp/" });


//............auth...............
router.post("/hotel/register", hotelAuthController.register);
router.post("/hotel/login", hotelAuthController.login);
router.post("/hotel/uploadFile", upload.single("file"), uploadFileController.uploadFile);
router.post("/hotel/completeSignup", hotelAuthController.completeSignup);
router.put("/hotel/updateProfile", auth, hotelAuthController.updateProfile);
router.post("/hotel/logout", auth, hotelAuthController.logout);
router.post("/hotel/refresh", auth, hotelAuthController.refresh);


//..............verification.........
router.post("/hotel/sendCodeToEmail", VerificationController.sendCodeToEmail);
router.post("/hotel/confirmEmail", VerificationController.confirmEmail);
router.post("/hotel/ResetLink", VerificationController.ResetLink);
router.post("/hotel/resetPassword", VerificationController.resetPassword);

module.exports = router;
 