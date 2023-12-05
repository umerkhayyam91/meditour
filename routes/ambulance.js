const express = require("express");
const ambulanceAuthController = require("../controller/Ambulance/ambulanceAuthController");
const hospDepartController = require("../controller/Hospital/hospDepartController");
const pharmMedController = require("../controller/Pharmacy/pharmMedController");
const pharmOrderController = require("../controller/Pharmacy/pharmOrderController");
const labTestController = require("../controller/Laboratory/labTestController");
const VerificationController = require("../controller/verificationController");
const docAvailabilityController = require("../controller/Doctor/doctorAvailabilityController")
const docAppointController = require("../controller/Doctor/doctorAppointController")
const auth = require('../middlewares/auth');
const uploadFileController = require("../controller/uploadFileController");
const multer = require("multer");
const router = express.Router();
const upload = multer({ dest: "temp/" });


//............auth...............
router.post("/ambulance/register", ambulanceAuthController.register);
router.post("/ambulance/login", ambulanceAuthController.login);
router.post("/ambulance/uploadFile", upload.single("file"), uploadFileController.uploadFile);
router.post("/ambulance/completeSignup", ambulanceAuthController.completeSignup);
router.put("/ambulance/updateProfile", auth, ambulanceAuthController.updateProfile);
router.post("/ambulance/logout", auth, ambulanceAuthController.logout);
router.post("/ambulance/refresh", auth, ambulanceAuthController.refresh);

//..............verification.........
router.post("/ambulance/sendCodeToEmail", VerificationController.sendCodeToEmail);
router.post("/ambulance/confirmEmail", VerificationController.confirmEmail);



module.exports = router;
