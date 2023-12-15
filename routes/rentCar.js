const express = require("express");
const rentCarAuthController = require("../controller/Rent A Car/rentCarAuthController");
const VerificationController = require("../controller/verificationController");
const auth = require('../middlewares/auth');
const uploadFileController = require("../controller/uploadFileController");
const multer = require("multer");
const router = express.Router();
const upload = multer({ dest: "temp/" });


//............auth...............
router.post("/rentCar/register", rentCarAuthController.register);
router.post("/rentCar/login", rentCarAuthController.login);
router.post("/rentCar/uploadFile", upload.single("file"), uploadFileController.uploadFile);
router.post("/rentCar/completeSignup", rentCarAuthController.completeSignup);
router.put("/rentCar/updateProfile", auth, rentCarAuthController.updateProfile);
router.post("/rentCar/logout", auth, rentCarAuthController.logout);
router.post("/rentCar/refresh", auth, rentCarAuthController.refresh);


//..............verification.........
router.post("/rentCar/sendCodeToEmail", VerificationController.sendCodeToEmail);
router.post("/rentCar/confirmEmail", VerificationController.confirmEmail);
router.post("/rentCar/ResetLink", VerificationController.ResetLink);
router.post("/rentCar/resetPassword", VerificationController.resetPassword);

module.exports = router;
 