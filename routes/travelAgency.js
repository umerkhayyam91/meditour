const express = require("express");
const agencyAuthController = require("../controller/Travel Agency/agencyAuthController");
const agencyOneWayFlightController = require("../controller/Travel Agency/agencyOneWayFlightController");
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

//...............one-way flight...................//
router.post("/agency/addOneWayFlight", auth, agencyOneWayFlightController.addOneWayFlight);
router.put("/agency/editOneWayFlight", auth, agencyOneWayFlightController.editOneWayFlight);
router.delete("/agency/deleteOneWayFlight", auth, agencyOneWayFlightController.deleteOneWayFlight);
router.get("/agency/getOneWayFlight", auth, agencyOneWayFlightController.getOneWayFlight);
router.get("/agency/getAllOneWayFlight", auth, agencyOneWayFlightController.getAllOneWayFlight);


//..............verification.........
router.post("/agency/sendCodeToEmail", VerificationController.sendCodeToEmail);
router.post("/agency/confirmEmail", VerificationController.confirmEmail);
router.post("/agency/ResetLink", VerificationController.ResetLink);
router.post("/agency/resetPassword", VerificationController.resetPassword);

module.exports = router;
 