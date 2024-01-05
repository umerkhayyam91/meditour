const express = require("express");
const ambulanceAuthController = require("../controller/Ambulance/ambulanceAuthController");
const ambulanceCrudController = require("../controller/Ambulance/ambulanceCrudController");
const ambulanceDashController = require("../controller/Ambulance/ambulanceDashController");
const ambulanceRequestController = require("../controller/Ambulance/ambulanceRequestController");
const VerificationController = require("../controller/verificationController");
const auth = require('../middlewares/auth');
const uploadFileController = require("../controller/uploadFileController");
const multer = require("multer");
const router = express.Router();
const upload = multer({ dest: "temp/" });


//..............auth...............
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
router.post("/ambulance/ResetLink", VerificationController.ResetLink);
router.post("/ambulance/resetPassword", VerificationController.resetPassword);

//...............dashboard...............
router.get("/ambulance/dashDetails",auth, ambulanceDashController.dashDetails)
router.get("/ambulance/graph",auth, ambulanceDashController.graph)

//.............ambulance CRUD...............
router.post("/ambulance/addAmbulance", auth, ambulanceCrudController.addAmbulance);
router.put("/ambulance/editAmbulance", auth, ambulanceCrudController.editAmbulance);
router.delete("/ambulance/deleteAmbulance", auth, ambulanceCrudController.deleteAmbulance);
router.get("/ambulance/getAmbulance", auth, ambulanceCrudController.getAmbulance);
router.get("/ambulance/getAllAmbulances", auth, ambulanceCrudController.getAllAmbulances);

//...............booking.......................
router.get("/ambulance/getRequests", auth, ambulanceRequestController.getRequests);
router.post("/ambulance/acceptRequest", auth, ambulanceRequestController.acceptRequest);
router.post("/ambulance/rejectRequest", auth, ambulanceRequestController.rejectRequest);
router.get("/ambulance/getOnRoutes", auth, ambulanceRequestController.getOnRoutes);
router.post("/ambulance/bookRequest", auth, ambulanceRequestController.bookRequest);
router.post("/ambulance/addRoute", auth, ambulanceRequestController.addRoute);


module.exports = router;
