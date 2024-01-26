const express = require("express");
const insuranceAuthController = require("../controller/Insurance/insuranceAuthController");
const insuranceIndividualHealthController = require("../controller/Insurance/insuranceIndividualHealthController");
const insuranceFamilyHealthController = require("../controller/Insurance/insuranceFamilyHealthController");
const insuranceParentHealthController = require("../controller/Insurance/insuranceParentHealthController");
const insuranceIndividualTravelController = require("../controller/Insurance/insuranceIndividualTravelController");
const VerificationController = require("../controller/verificationController");
const auth = require('../middlewares/auth');
const uploadFileController = require("../controller/uploadFileController");
const multer = require("multer");
const router = express.Router();
const upload = multer({ dest: "temp/" });


//............auth...............
router.post("/insurance/register", insuranceAuthController.register);
router.post("/insurance/login", insuranceAuthController.login);
router.post("/insurance/uploadFile", upload.single("file"), uploadFileController.uploadFile);
router.post("/insurance/completeSignup", insuranceAuthController.completeSignup);
router.put("/insurance/updateProfile", auth, insuranceAuthController.updateProfile);
router.post("/insurance/logout", auth, insuranceAuthController.logout);
router.post("/insurance/refresh", auth, insuranceAuthController.refresh);

//.............individual health../.....................//
router.post("/insurance/addIndividualHealth", auth, insuranceIndividualHealthController.addIndividualHealth);
router.put("/insurance/editIndividualHealth", auth, insuranceIndividualHealthController.editIndividualHealth);
router.delete("/insurance/deleteIndividualHealth", auth, insuranceIndividualHealthController.deleteIndividualHealth);
router.get("/insurance/getIndividualHealth", auth, insuranceIndividualHealthController.getIndividualHealth);
router.get("/insurance/getAllIndividualHealth", auth, insuranceIndividualHealthController.getAllIndividualHealth);

//.............family health../.....................//
router.post("/insurance/addFamilyHealth", auth, insuranceFamilyHealthController.addFamilyHealth);
router.put("/insurance/editFamilyHealth", auth, insuranceFamilyHealthController.editFamilyHealth);
router.delete("/insurance/deleteFamilyHealth", auth, insuranceFamilyHealthController.deleteFamilyHealth);
router.get("/insurance/getFamilyHealth", auth, insuranceFamilyHealthController.getFamilyHealth);
router.get("/insurance/getAllFamilyHealth", auth, insuranceFamilyHealthController.getAllFamilyHealth);

//.............parent health../.....................//
router.post("/insurance/addParentHealth", auth, insuranceParentHealthController.addParentHealth);
router.put("/insurance/editParentHealth", auth, insuranceParentHealthController.editParentHealth);
router.delete("/insurance/deleteParentHealth", auth, insuranceParentHealthController.deleteParentHealth);
router.get("/insurance/getParentHealth", auth, insuranceParentHealthController.getParentHealth);
router.get("/insurance/getAllParentHealth", auth, insuranceParentHealthController.getAllParentHealth);

//.............individual Travel../.....................//
router.post("/insurance/addIndividualTravel", auth, insuranceIndividualTravelController.addIndividualTravel);
router.put("/insurance/editIndividualTravel", auth, insuranceIndividualTravelController.editIndividualTravel);
router.delete("/insurance/deleteIndividualTravel", auth, insuranceIndividualTravelController.deleteIndividualTravel);
router.get("/insurance/getIndividualTravel", auth, insuranceIndividualTravelController.getIndividualTravel);
router.get("/insurance/getAllIndividualTravel", auth, insuranceIndividualTravelController.getAllIndividualTravel);

//..............verification.........
router.post("/insurance/sendCodeToEmail", VerificationController.sendCodeToEmail);
router.post("/insurance/confirmEmail", VerificationController.confirmEmail);
router.post("/insurance/ResetLink", VerificationController.ResetLink);
router.post("/insurance/resetPassword", VerificationController.resetPassword);

module.exports = router;
