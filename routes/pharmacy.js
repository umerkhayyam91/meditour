const express = require("express");
const pharmAuthController = require("../controller/Pharmacy/pharmAuthController");
const labOrderController = require("../controller/Laboratory/labOrderController");
const labTestController = require("../controller/Laboratory/labTestController");
const VerificationController = require("../controller/verificationController");
const auth = require('../middlewares/auth');
const uploadFileController = require("../controller/uploadFileController");
const multer = require("multer");
const router = express.Router();
const upload = multer({ dest: "temp/" });


//............auth...........
router.post("/pharm/register", pharmAuthController.register);
router.post("/pharm/login", pharmAuthController.login);
router.post("/pharm/verify", pharmAuthController.verify);
router.post("/pharm/updateProfile", auth, pharmAuthController.updateProfile);

module.exports = router;
