const express = require("express");
const userAuthController = require("../controller/User/userAuthController");
const VerificationController = require("../controller/verificationController");
// const docAvailabilityController = require("../controller/Doctor/doctorAvailabilityController")
// const generalRequestController = require("../controller/All Doctors Controllers/generalRequestController")
const auth = require('../middlewares/auth');
// const uploadFileController = require("../controller/uploadFileController");
const multer = require("multer");
const router = express.Router();
// const upload = multer({ dest: "temp/" });


//............auth...............
router.post("/user/register", userAuthController.register);
router.post("/user/login", userAuthController.login);
// router.put("/user/updateProfile", auth, userAuthController.updateProfile);
router.post("/user/logout", auth, userAuthController.logout);
// router.post("/user/refresh", auth, userAuthController.refresh);

//..............verification.........
router.post("/user/sendCodeToEmail", VerificationController.sendCodeToEmail);
router.post("/user/confirmEmail", VerificationController.confirmEmail);
router.post("/user/ResetLink", VerificationController.ResetLink);
router.post("/user/resetPassword", VerificationController.resetPassword);

module.exports = router;
 