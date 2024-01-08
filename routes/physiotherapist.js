const express = require("express");
const physioAuthController = require("../controller/Physiotherapist/physioAuthController");
const VerificationController = require("../controller/verificationController");
const physioAvailabilityController = require("../controller/Physiotherapist/physioAvailabilityController")
const physioAppointController = require("../controller/Physiotherapist/physioAppointController")
const generalRequestController = require("../controller/All Doctors Controllers/generalRequestController")
const physioDashController = require("../controller/Physiotherapist/physioDashController")
const auth = require('../middlewares/auth');
const uploadFileController = require("../controller/uploadFileController");
const multer = require("multer");
const router = express.Router();
const upload = multer({ dest: "temp/" });


//............auth...............
router.post("/physio/register", physioAuthController.register);
router.post("/physio/login", physioAuthController.login);
router.post("/physio/uploadFile", upload.single("file"), uploadFileController.uploadFile);
router.post("/physio/completeSignup", physioAuthController.completeSignup);
router.put("/physio/updateProfile", auth, physioAuthController.updateProfile);
router.post("/physio/logout", auth, physioAuthController.logout);
router.post("/physio/refresh", auth, physioAuthController.refresh);

//............Dashboard.................
router.get("/physio/dashDetails", auth, physioDashController.dashDetails);
router.get("/physio/graph", auth, physioDashController.graph);

//............availability............
router.post("/physio/addAvailability", auth, physioAvailabilityController.addAvailability);
router.get("/physio/getAvailability", auth, physioAvailabilityController.getAvailability);

//............appointments..............
router.get("/physio/getAllAppointments", auth, physioAppointController.getAllAppointments);
router.get("/physio/getAllPatients", auth, physioAppointController.getAllPatients);
router.get("/physio/patientHistory", auth, physioAppointController.patientHistory);
// router.post("/physio/addAppoints", auth, generalRequestController.addAppoints);


//.............Appointment Requests........................
router.get("/physio/getRequests", auth, generalRequestController.getRequests);
router.post("/physio/acceptRequest", auth, generalRequestController.acceptRequest);
router.delete("/physio/rejectRequest", auth, generalRequestController.rejectRequest);


//..............verification.........
router.post("/physio/sendCodeToEmail", VerificationController.sendCodeToEmail);
router.post("/physio/confirmEmail", VerificationController.confirmEmail);
router.post("/physio/ResetLink", VerificationController.ResetLink);
router.post("/physio/resetPassword", VerificationController.resetPassword);

module.exports = router;
 