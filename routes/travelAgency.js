const express = require("express");
const agencyAuthController = require("../controller/Travel Agency/agencyAuthController");
const VerificationController = require("../controller/verificationController");
const auth = require('../middlewares/auth');
const uploadFileController = require("../controller/uploadFileController");
const multer = require("multer");
const router = express.Router();
const upload = multer({ dest: "temp/" });


//............auth...............
router.post("/agency/register", agencyAuthController.register);
router.post("/agency/login", agencyAuthController.login);
router.post("/agency/uploadFile", upload.single("file"), uploadFileController.uploadFile);
router.post("/agency/completeSignup", agencyAuthController.completeSignup);
router.put("/agency/updateProfile", auth, agencyAuthController.updateProfile);
router.post("/agency/logout", auth, agencyAuthController.logout);
router.post("/agency/refresh", auth, agencyAuthController.refresh);


//..............verification.........
router.post("/agency/sendCodeToEmail", VerificationController.sendCodeToEmail);
router.post("/agency/confirmEmail", VerificationController.confirmEmail);
router.post("/agency/ResetLink", VerificationController.ResetLink);
router.post("/agency/resetPassword", VerificationController.resetPassword);

module.exports = router;
 