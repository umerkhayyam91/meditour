const express = require("express");
const docAuthController = require("../controller/Doctor/doctorAuthController");
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
router.post("/doc/register", docAuthController.register);
router.post("/doc/login", docAuthController.login);
router.post("/doc/uploadFile", upload.single("file"), uploadFileController.uploadFile);
router.post("/doc/completeSignup", docAuthController.completeSignup);
router.put("/doc/updateProfile", auth, docAuthController.updateProfile);
router.post("/doc/logout", auth, docAuthController.logout);
router.post("/doc/refresh", auth, docAuthController.refresh);

//............availability............
router.post("/doc/addAvailability", auth, docAvailabilityController.addAvailability);
router.get("/doc/getAvailability", auth, docAvailabilityController.getAvailability);

//............appointments..............
router.get("/doc/getAllAppointments", auth, docAppointController.getAllAppointments);
router.get("/doc/getAllPatients", auth, docAppointController.getAllPatients);
// router.post("/doc/addAppoints", auth, docAppointController.addAppoints);


//..............verification.........
router.post("/doc/sendCodeToEmail", VerificationController.sendCodeToEmail);
router.post("/doc/confirmEmail", VerificationController.confirmEmail);

module.exports = router;
 