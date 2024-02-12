const express = require("express");
const agencyAuthController = require("../controller/Travel Agency/agencyAuthController");
const agencyOneWayFlightController = require("../controller/Travel Agency/agencyOneWayFlightController");
const agencyRoundTripFlightController = require("../controller/Travel Agency/agencyRoundTripFlightController");
const agencyMultiTripFlightController = require("../controller/Travel Agency/agencyMultiTripFlightController");
const agencyTourController = require("../controller/Travel Agency/agencyTourController");
const agencyRequestController = require("../controller/Travel Agency/agencyReqController");
const agencyDashController = require("../controller/Travel Agency/agencyDashController");
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

//...............round-trip flight...................//
router.post("/agency/addRoundTripFlight", auth, agencyRoundTripFlightController.addRoundTripFlight);
router.put("/agency/editRoundTripFlight", auth, agencyRoundTripFlightController.editRoundTripFlight);
router.delete("/agency/deleteRoundTripFlight", auth, agencyRoundTripFlightController.deleteRoundTripFlight);
router.get("/agency/getRoundTripFlight", auth, agencyRoundTripFlightController.getRoundTripFlight);
router.get("/agency/getAllRoundTripFlight", auth, agencyRoundTripFlightController.getAllRoundTripFlight);

//...............multi-trip flight...................//
router.post("/agency/addMultiTripFlight", auth, agencyMultiTripFlightController.addMultiTripFlight);
router.put("/agency/editMultiTripFlight", auth, agencyMultiTripFlightController.editMultiTripFlight);
router.delete("/agency/deleteMultiTripFlight", auth, agencyMultiTripFlightController.deleteMultiTripFlight);
router.get("/agency/getMultiTripFlight", auth, agencyMultiTripFlightController.getMultiTripFlight);
router.get("/agency/getAllMultiTripFlight", auth, agencyMultiTripFlightController.getAllMultiTripFlight);

//...............tour...................//
router.post("/agency/addTour", auth, agencyTourController.addTour);
router.put("/agency/editTour", auth, agencyTourController.editTour);
router.delete("/agency/deleteTour", auth, agencyTourController.deleteTour);
router.get("/agency/getTour", auth, agencyTourController.getTour);
router.get("/agency/getAllTour", auth, agencyTourController.getAllTour);

//................requests..................//
router.post("/agency/addBookings", agencyRequestController.addBookings);
router.get("/agency/getAllRequests", auth, agencyRequestController.getAllBookings);

//................dashboard.................//
router.get("/agency/dashDetails", auth, agencyDashController.dashDetails)

//..............verification.........
router.post("/agency/sendCodeToEmail", VerificationController.sendCodeToEmail);
router.post("/agency/confirmEmail", VerificationController.confirmEmail);
router.post("/agency/ResetLink", VerificationController.ResetLink);
router.post("/agency/resetPassword", VerificationController.resetPassword);

module.exports = router;
 