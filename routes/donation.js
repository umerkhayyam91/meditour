const express = require("express");
const donationAuthController = require("../controller/Donation/donationAuthController");
const donationpackageController = require("../controller/Donation/donationPackageController");
const donationDonationsController = require("../controller/Donation/donationDonationsController");
const donationDashController = require("../controller/Donation/donationDashController");
const donationCriteriaController = require("../controller/Donation/donationCriteriaController");
const VerificationController = require("../controller/verificationController");
const auth = require('../middlewares/auth');
const uploadFileController = require("../controller/uploadFileController");
const multer = require("multer");
const router = express.Router();
const upload = multer({ dest: "temp/" });


//............auth...............
router.post("/donation/register", donationAuthController.register);
router.post("/donation/login", donationAuthController.login);
router.post("/donation/uploadFile", upload.single("file"), uploadFileController.uploadFile);
router.post("/donation/completeSignup", donationAuthController.completeSignup);
router.put("/donation/updateProfile", auth, donationAuthController.updateProfile);
router.post("/donation/logout", auth, donationAuthController.logout);
router.post("/donation/refresh", auth, donationAuthController.refresh);

//............packages................//
router.post("/donation/addPackage", auth, donationpackageController.addPackage);
router.put("/donation/editPackage", auth, donationpackageController.editPackage);
router.delete("/donation/deletePackage", auth, donationpackageController.deletePackage);
router.get("/donation/getPackage", auth, donationpackageController.getPackage);
router.get("/donation/getAllPackages", auth, donationpackageController.getAllPackages);
router.post("/donation/addDonation", auth, donationpackageController.addDonation);

//..........donations............///
router.get("/donation/getAllDonations", auth, donationDonationsController.getAllDonations);
router.get("/donation/getDonor", donationDonationsController.getDonor);

//..........criteria............///
router.post("/donation/addCriteria", auth, donationCriteriaController.addCriteria);
router.put("/donation/editCriteria", auth, donationCriteriaController.editCriteria);
router.delete("/donation/deleteCriteria", auth, donationCriteriaController.deleteCriteria);
router.get("/donation/getCriteria", auth, donationCriteriaController.getCriteria);
router.get("/donation/getAllCriterion", auth, donationCriteriaController.getAllCriterion);

//.............dashboard.............//
router.get("/donation/graph", auth, donationDashController.graph);
router.get("/donation/dashDetails", auth, donationDashController.dashDetails);

//..............verification.........
router.post("/donation/sendCodeToEmail", VerificationController.sendCodeToEmail);
router.post("/donation/confirmEmail", VerificationController.confirmEmail);
router.post("/donation/ResetLink", VerificationController.ResetLink);
router.post("/donation/resetPassword", VerificationController.resetPassword);

module.exports = router;
