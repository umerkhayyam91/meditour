const express = require("express");
const nutritionistAuthController = require("../controller/Nutritionist/nutritionAuthController");
const VerificationController = require("../controller/verificationController");
const docAvailabilityController = require("../controller/Doctor/doctorAvailabilityController")
const docAppointController = require("../controller/Doctor/doctorAppointController")
const auth = require('../middlewares/auth');
const uploadFileController = require("../controller/uploadFileController");
const multer = require("multer");
const router = express.Router();
const upload = multer({ dest: "temp/" });


//............auth...............
router.post("/nutritionist/register", nutritionistAuthController.register);
router.post("/nutritionist/login", nutritionistAuthController.login);
router.post("/nutritionist/uploadFile", upload.single("file"), uploadFileController.uploadFile);
router.post("/nutritionist/completeSignup", nutritionistAuthController.completeSignup);
router.put("/nutritionist/updateProfile", auth, nutritionistAuthController.updateProfile);
router.post("/nutritionist/logout", auth, nutritionistAuthController.logout);
router.post("/nutritionist/refresh", auth, nutritionistAuthController.refresh);


//..............verification.........
router.post("/nutritionist/sendCodeToEmail", VerificationController.sendCodeToEmail);
router.post("/nutritionist/confirmEmail", VerificationController.confirmEmail);
router.post("/nutritionist/ResetLink", VerificationController.ResetLink);
router.post("/nutritionist/resetPassword", VerificationController.resetPassword);

module.exports = router;
 