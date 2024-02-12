const express = require("express");
const userAuthController = require("../controller/User/userAuthController");
const VerificationController = require("../controller/verificationController");
const auth = require("../middlewares/auth");
const multer = require("multer");
const userLabController = require("../controller/User/labController");
const router = express.Router();

//............auth...............
router.post("/user/register", userAuthController.register);
router.post("/user/login", userAuthController.login);
router.post("/user/logout", auth, userAuthController.logout);

//..............verification.........
router.post("/user/sendCodeToEmail", VerificationController.sendCodeToEmail);
router.post("/user/confirmEmail", VerificationController.confirmEmail);
router.post("/user/ResetLink", VerificationController.ResetLink);
router.post("/user/resetPassword", VerificationController.resetPassword);

//.............Laboratory...................//
router.get("/user/getNearbyLabs", userLabController.getNearbyLabs);

module.exports = router;
