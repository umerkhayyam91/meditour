const express = require("express");
const rentCarAuthController = require("../controller/Rent A Car/rentCarAuthController");
const VerificationController = require("../controller/verificationController");
const auth = require('../middlewares/auth');
const uploadFileController = require("../controller/uploadFileController");
const multer = require("multer");
const vehicleDetailController = require("../controller/Rent A Car/vehicleDetailController");
const vehicleRequestController = require("../controller/Rent A Car/vehicleRequestController");
const rentCarDashController = require("../controller/Rent A Car/rentCarDashController");
const router = express.Router();
const upload = multer({ dest: "temp/" });


//............auth...............
router.post("/rentCar/register", rentCarAuthController.register);
router.post("/rentCar/login", rentCarAuthController.login);
router.post("/rentCar/uploadFile", upload.single("file"), uploadFileController.uploadFile);
router.post("/rentCar/completeSignup", rentCarAuthController.completeSignup);
router.put("/rentCar/updateProfile", auth, rentCarAuthController.updateProfile);
router.post("/rentCar/logout", auth, rentCarAuthController.logout);
router.post("/rentCar/refresh", auth, rentCarAuthController.refresh);


//..............verification.........
router.post("/rentCar/sendCodeToEmail", VerificationController.sendCodeToEmail);
router.post("/rentCar/confirmEmail", VerificationController.confirmEmail);
router.post("/rentCar/ResetLink", VerificationController.ResetLink);
router.post("/rentCar/resetPassword", VerificationController.resetPassword);

// ...crud vehicle details

router.post("/rentCar/addVehicle", auth, vehicleDetailController.addVehicle);
router.put("/rentCar/editVehicle",auth, vehicleDetailController.editVehicle);
router.delete("/rentCar/deleteVehicle",auth, vehicleDetailController.deleteVehicle);
router.get("/rentCar/getVehicle",auth, vehicleDetailController.getVehicle);
router.get("/rentCar/getAllVehicles",auth, vehicleDetailController.getAllVehicles);
// ..... vehicle requests

router.post("/rentCar/addRequests", auth, vehicleRequestController.addRequests);
router.get("/rentCar/getAllRequests", auth, vehicleRequestController.getAllRequests);
router.post("/rentCar/acceptRequest", auth, vehicleRequestController.acceptRequest);
router.post("/rentCar/rejectRequest", auth, vehicleRequestController.rejectRequest);
//  dashboard
router.get("/rentCar/dashDetails", auth,rentCarDashController.dashDetails);
router.get("/rentCar/graph", auth,rentCarDashController.graph);




module.exports = router;
 