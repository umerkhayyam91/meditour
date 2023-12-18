const express = require("express");
const insuranceAuthController = require("../controller/Insurance/insuranceAuthController");
const VerificationController = require("../controller/verificationController");
const auth = require('../middlewares/auth');
const uploadFileController = require("../controller/uploadFileController");
const multer = require("multer");
const router = express.Router();
const upload = multer({ dest: "temp/" });


//............auth...............
router.post("/insurance/register", insuranceAuthController.register);
router.post("/insurance/login", insuranceAuthController.login);
router.post("/insurance/uploadFile", upload.single("file"), uploadFileController.uploadFile);
router.post("/insurance/completeSignup", insuranceAuthController.completeSignup);
router.put("/insurance/updateProfile", auth, insuranceAuthController.updateProfile);
router.post("/insurance/logout", auth, insuranceAuthController.logout);
router.post("/insurance/refresh", auth, insuranceAuthController.refresh);


//..............verification.........
router.post("/insurance/sendCodeToEmail", VerificationController.sendCodeToEmail);
router.post("/insurance/confirmEmail", VerificationController.confirmEmail);
router.post("/insurance/ResetLink", VerificationController.ResetLink);
router.post("/insurance/resetPassword", VerificationController.resetPassword);

module.exports = router;
 