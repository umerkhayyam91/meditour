const express = require("express");
const docAuthController = require("../controller/Doctor/doctorAuthController");
const VerificationController = require("../controller/verificationController");
const docAvailabilityController = require("../controller/Doctor/doctorAvailabilityController")
const docAppointController = require("../controller/Doctor/doctorAppointController")
const docDashController = require("../controller/Doctor/doctorDashController")
const docRequestController = require("../controller/Doctor/doctorRequestController")
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

//............Dashboard.................
router.get("/doc/dashDetails", auth, docDashController.dashDetails);
router.get("/doc/graph", auth, docDashController.graph);

//............availability............
router.post("/doc/addAvailability", auth, docAvailabilityController.addAvailability);
router.get("/doc/getAvailability", auth, docAvailabilityController.getAvailability);

//............appointments..............
router.get("/doc/getAllAppointments", auth, docAppointController.getAllAppointments);
router.get("/doc/getAllPatients", auth, docAppointController.getAllPatients);
router.get("/doc/patientHistory", auth, docAppointController.patientHistory);
router.get("/doc/getRequests", auth, docRequestController.getRequests);
// router.post("/doc/addAppoints", auth, docAppointController.addAppoints);


//..............verification.........
router.post("/doc/sendCodeToEmail", VerificationController.sendCodeToEmail);
router.post("/doc/confirmEmail", VerificationController.confirmEmail);
router.post("/doc/ResetLink", VerificationController.ResetLink);
router.post("/doc/resetPassword", VerificationController.resetPassword);

module.exports = router;
 