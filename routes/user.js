const express = require("express");
const userAuthController = require("../controller/User/userAuthController");
const VerificationController = require("../controller/verificationController");
const labTestController = require("../controller/Laboratory/labTestController");
const auth = require("../middlewares/auth");
const multer = require("multer");
const userLabController = require("../controller/User/labController");
const userPharmacyController = require("../controller/User/pharmacyController");
const router = express.Router();

//............auth...............
router.post("/user/register", userAuthController.register);
router.post("/user/login", userAuthController.login);
router.post("/user/logout", auth, userAuthController.logout);

//..............verification.........
router.post("/user/sendCodeToEmail", VerificationController.sendCodeToEmail);
router.post("/user/confirmEmail", VerificationController.confirmEmail);
router.post("/user/ResetLink", VerificationController.ResetLink);
router.post("/user/resetPassword", VerificationController.resetPassword);

//.............Laboratory...................//
router.get("/user/getNearbyLabs", userLabController.getNearbyLabs);
router.get("/user/getLab", userLabController.getLab);
router.get("/user/filterLabs", userLabController.filterLabs);
router.get("/user/getTest", labTestController.getTest);
router.get("/user/getAllTests", userLabController.getAllTests);
router.put("/user/addRemoveFav", auth, userLabController.addRemoveFav);
router.get("/user/getAllFav", auth, userLabController.getAllFav);

//.............Pharmacy...................//
router.get("/user/getNearbyPharmacies", userPharmacyController.getNearbyPharmacies);
router.get("/user/getPharmacy", userPharmacyController.getPharmacy);
router.get("/user/filterPharmacies", userPharmacyController.filterPharmacies);
router.post("/user/addToCart", auth, userPharmacyController.addToCart);
router.get("/user/getCart", auth, userPharmacyController.getCart);

module.exports = router;
