const express = require("express");
const hospAuthController = require("../controller/Hospital/hospAuthController");
const hospDepartController = require("../controller/Hospital/hospDepartController");
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
router.post("/hosp/register", hospAuthController.register);
router.post("/hosp/login", hospAuthController.login);
router.post("/hosp/uploadFile", upload.single("file"), uploadFileController.uploadFile);
router.post("/hosp/completeSignup", hospAuthController.completeSignup);
router.put("/hosp/updateProfile", auth, hospAuthController.updateProfile);
router.post("/hosp/logout", auth, hospAuthController.logout);
router.post("/hosp/refresh", auth, hospAuthController.refresh);

//..............verification.........
router.post("/hosp/sendCodeToEmail", VerificationController.sendCodeToEmail);
router.post("/hosp/confirmEmail", VerificationController.confirmEmail);

//..............department..............
router.post("/hosp/addDepart", auth, hospDepartController.addDepart);
router.put("/hosp/editDepart", auth, hospDepartController.editDepart);


module.exports = router;
